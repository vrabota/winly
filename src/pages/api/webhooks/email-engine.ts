import { AccountState, ActivityStatus } from '@prisma/client';
import omit from 'lodash/omit';

import { logger } from '@utils/logger';
import { prisma } from '@server/db';
import { WEBHOOKS } from '@utils/webhooks';
import { updateAccountState } from '@webhooks/updateAccountState';
import { CampaignsService } from '@server/api/campaigns/campaigns.service';

import type { Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  logger.info({ webhook: req.body }, `Webhook event`);

  switch (req.body.event) {
    case WEBHOOKS.ACCOUNT_CONNECT_ERROR: {
      const updatedAccount = await updateAccountState({
        accountId: req.body.account,
        state: AccountState.DISCONNECTED,
      });
      logger.info(
        { webhook: req.body, updatedAccount },
        `Webhook ${req.body.event}: Connection error to Email Engine service.`,
      );
      break;
    }
    case WEBHOOKS.ACCOUNT_AUTH_ERROR: {
      const updatedAccount = await updateAccountState({ accountId: req.body.account, state: AccountState.ERROR });
      logger.info(
        { webhook: req.body, updatedAccount },
        `Webhook ${req.body.event}: Connection auth error to Email Engine service.`,
      );
      break;
    }
    case WEBHOOKS.ACCOUNT_ADDED: {
      const updatedAccount = await updateAccountState({ accountId: req.body.account, state: AccountState.CONNECTING });
      logger.info(
        { webhook: req.body, updatedAccount },
        `Webhook ${req.body.event}: Connecting new account to Email Engine service.`,
      );
      break;
    }
    case WEBHOOKS.ACCOUNT_INITIALIZED:
    case WEBHOOKS.ACCOUNT_AUTH_SUCCESS: {
      const updatedAccount = await updateAccountState({ accountId: req.body.account, state: AccountState.CONNECTED });
      logger.info({ webhook: req.body, updatedAccount }, `Webhook ${req.body.event}: Account successfully connected`);
      break;
    }
    case WEBHOOKS.ACCOUNT_DELETED: {
      const account = await prisma.account.findUnique({ where: { id: req.body.account } });
      if (account) {
        await prisma.account.delete({ where: { id: req.body.account } });
        logger.info({ webhook: req.body }, `Successful webhook event ${WEBHOOKS.ACCOUNT_DELETED} executed`);
      }
      break;
    }
    case WEBHOOKS.TRACK_OPEN:
    case WEBHOOKS.MESSAGE_MISSING:
    case WEBHOOKS.MESSAGE_DELIVERY_ERROR:
    case WEBHOOKS.MESSAGE_FAILED:
    case WEBHOOKS.MESSAGE_BOUNCE: {
      const activity = await prisma.activity.findFirst({ where: { messageId: req.body.data.messageId } });
      const status: Record<string, ActivityStatus> = {
        [WEBHOOKS.TRACK_OPEN]: ActivityStatus.OPENED,
        [WEBHOOKS.MESSAGE_BOUNCE]: ActivityStatus.BOUNCED,
        [WEBHOOKS.MESSAGE_MISSING]: ActivityStatus.ERROR,
        [WEBHOOKS.MESSAGE_DELIVERY_ERROR]: ActivityStatus.ERROR,
        [WEBHOOKS.MESSAGE_FAILED]: ActivityStatus.ERROR,
      };
      if (activity) {
        const createdActivity = await prisma.activity.create({
          data: {
            ...omit(activity, ['id', 'createdAt', 'updatedAt', 'queueId']),
            status: status[req.body.event as string],
          },
        });
        const queuedActivity = await prisma.activity.findFirst({
          where: {
            messageId: createdActivity.messageId,
            status: ActivityStatus.QUEUED,
          },
        });
        if (queuedActivity) {
          await prisma.activity.delete({
            where: {
              id: queuedActivity.id,
            },
          });
        }
      }
      break;
    }
    case WEBHOOKS.MESSAGE_NEW: {
      const {
        specialUse,
        data: { inReplyTo, labels, threadId },
      } = req.body;
      if ((inReplyTo && specialUse.includes('All')) || labels.includes('\\Inbox')) {
        const activity = await prisma.activity.findFirst({ where: { messageId: inReplyTo } });
        if (activity) {
          const createdActivity = await prisma.activity.create({
            data: {
              ...omit(activity, ['id', 'createdAt', 'updatedAt', 'queueId']),
              status: ActivityStatus.REPLIED,
              threadId,
            },
            select: {
              campaign: true,
            },
          });

          if (createdActivity.campaign.sendOnReply) {
            // STOP sending on reply
            const queueIds = await prisma.activity.findMany({
              where: {
                campaignId: activity.campaignId,
                organizationId: activity.organizationId,
                status: { equals: ActivityStatus.QUEUED },
                leadEmail: activity.leadEmail,
              },
              select: { queueId: true },
            });

            for (const item of queueIds) {
              if (typeof item.queueId === 'string') {
                await CampaignsService.stopCampaign(item.queueId);
              }
            }

            await prisma.activity.deleteMany({
              where: {
                campaignId: activity.campaignId,
                organizationId: activity.organizationId,
                status: { equals: ActivityStatus.QUEUED },
              },
            });
          }
        }
      }
      break;
    }
    case WEBHOOKS.MESSAGE_SENT: {
      const activity = await prisma.activity.findFirst({
        where: { messageId: req.body.data.messageId },
        include: { campaign: true },
      });
      const sequences = activity?.campaign.sequences as Prisma.JsonArray;
      if (activity) {
        await prisma.activity.create({
          data: {
            ...omit(activity, ['id', 'createdAt', 'updatedAt', 'queueId', 'campaign']),
            status: ActivityStatus.CONTACTED,
          },
        });
        if (activity.step === sequences.length) {
          await prisma.activity.create({
            data: {
              ...omit(activity, ['id', 'createdAt', 'updatedAt', 'queueId', 'campaign']),
              status: ActivityStatus.COMPLETED,
            },
          });
        }
      }
      if (activity?.status === ActivityStatus.QUEUED) {
        await prisma.activity.delete({
          where: {
            id: activity.id,
          },
        });
      }
      break;
    }
  }

  res.status(200).json({ message: 'Webhook processed.' });
}
