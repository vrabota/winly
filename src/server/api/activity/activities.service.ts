import { TRPCError } from '@trpc/server';

import { emailApi } from '@utils/emailApi';
import { logger } from '@utils/logger';

import { LeadsRepository } from '../leads/leads.repository';

import type { LeadStatus } from '@prisma/client';
import type { components } from '@schema/api';

type MessageListEntry = components['schemas']['MessageListEntry'];

interface ThreadMessages extends MessageListEntry {
  bodyText: components['schemas']['TextResponse'];
  lead: {
    status: LeadStatus;
    id: string;
  };
}

export class ActivitiesService {
  static async getThreadMessages(accountId: string, threadId: string): Promise<ThreadMessages[]> {
    try {
      const messages: ThreadMessages[] = [];
      const { data: searchData } = await emailApi.post(
        `/account/${accountId}/search?documentStore=false&path=[Gmail]/All Mail`,
        {
          search: { threadId },
        },
      );
      for (const message of searchData?.messages) {
        const lead = await LeadsRepository.getLeadByEmail(message?.from?.address);
        const { data: textData } = await emailApi.get(`/account/${accountId}/text/${message.text.id}`);
        messages.push({ ...message, bodyText: textData, lead });
      }
      return messages;
    } catch (error) {
      logger.info(
        { error },
        `Can not get thread messages from Email Engine service for thread ${threadId} and account ${accountId}.`,
      );

      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Unfortunately can not get thread messages from service.`,
        cause: error,
      });
    }
  }
}
