import dayjs, { extend } from 'dayjs';
import chunk from 'lodash/chunk';
import random from 'lodash/random';
import timezone from 'dayjs/plugin/timezone';
import isoWeek from 'dayjs/plugin/isoWeek';
import isToday from 'dayjs/plugin/isToday';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Service } from 'typedi';

import { emailApi } from '@utils/emailApi';
import { logger } from '@utils/logger';

import type { AccountActivityMailMerge, ActivityMailMergeOutput } from '@server/api/activity/activity.dto';
import type { Dayjs } from 'dayjs';
import type { SequencesType } from './campaigns.dto';
import type { Account, Campaign, Lead } from '@prisma/client';

extend(timezone);
extend(isoWeek);
extend(isToday);
extend(customParseFormat);

@Service()
export class CampaignsService {
  async startCampaign({
    campaign,
    leads,
    accounts,
  }: {
    campaign: Campaign;
    leads: Lead[];
    accounts: Account[];
  }): Promise<AccountActivityMailMerge[]> {
    const sequences = campaign.sequences as SequencesType[];
    const time = campaign.time as { from: string; to: string };
    const scheduleDays = campaign.scheduleDays as string[];
    campaign?.timezone && dayjs.tz.setDefault(campaign?.timezone);

    function getNextAvailableDate(startTime: Dayjs, endTime: Dayjs, availableDays: number[]) {
      const today = dayjs();
      const todayDayOfWeek = today.isoWeekday();

      if (availableDays.includes(todayDayOfWeek) && today.diff(endTime, 'm') < 0) {
        return today;
      }

      let nextAvailableDay = today.add(1, 'day');
      while (!availableDays.includes(nextAvailableDay.day())) {
        nextAvailableDay = nextAvailableDay.add(1, 'day');
      }

      return nextAvailableDay.hour(startTime.hour()).minute(startTime.minute());
    }

    const startTime = dayjs(time.from, 'HH:mm A');
    const endTime = dayjs(time.to, 'hh:mm A');
    const availableDays = scheduleDays.map(item => Number(item));
    let nextAvailableDateTime = getNextAvailableDate(startTime, endTime, availableDays);
    let dailyLimitCounter = 0;
    const messages = [];

    const ratio = Math.round(leads.length / accounts.length);
    for (const [sequenceIndex, sequence] of sequences.entries()) {
      if (sequence?.delay) {
        nextAvailableDateTime = dayjs()
          .add(Number(sequence.delay), 'd')
          .hour(startTime.hour())
          .minute(startTime.minute());
      }
      for (const [index, account] of accounts.entries()) {
        const leadsChunk = chunk(leads, ratio);

        const response = await emailApi.post(`/account/${account.id}/submit`, {
          subject: sequence.subject,
          html: sequence.body,
          trackingEnabled: campaign.openTracking,
          mailMerge: leadsChunk?.[index]?.map(lead => {
            nextAvailableDateTime = nextAvailableDateTime.add(random(6, 9), 'm');
            dailyLimitCounter = dailyLimitCounter + 1;

            if (nextAvailableDateTime.isToday() && nextAvailableDateTime.diff(endTime, 'm') > 0) {
              nextAvailableDateTime = nextAvailableDateTime
                .add(1, 'd')
                .hour(startTime.hour())
                .minute(startTime.minute());
            }
            if (nextAvailableDateTime.isToday() && nextAvailableDateTime.diff(startTime, 'm') < 0) {
              nextAvailableDateTime = nextAvailableDateTime.add(
                Math.abs(nextAvailableDateTime.diff(startTime, 'm')) + 1,
                'm',
              );
            }
            if (nextAvailableDateTime.isToday() && campaign.dailyLimit && dailyLimitCounter > campaign.dailyLimit) {
              nextAvailableDateTime = nextAvailableDateTime
                .add(1, 'd')
                .hour(startTime.hour())
                .minute(startTime.minute());
              dailyLimitCounter = 0;
            }

            const payload = {
              to: {
                name: `${lead.firstName} ${lead.lastName}`,
                address: lead.email,
              },
              params: {
                firstName: lead.firstName,
              },
              sendAt: nextAvailableDateTime.format(),
            };

            logger.info({ payload }, `Message payload for campaign submit.`);

            return payload;
          }),
        });
        const messagesData = response.data.mailMerge.map((item: ActivityMailMergeOutput) => ({
          ...item,
          accountId: account.id,
          step: sequenceIndex + 1,
        }));
        messages.push(...messagesData);
      }
    }
    return messages;
  }
}
