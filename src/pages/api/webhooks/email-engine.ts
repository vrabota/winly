import { AccountState, ActivityStatus, WarmupStatus } from '@prisma/client';
import omit from 'lodash/omit';
import truncate from 'lodash/truncate';
import axios from 'axios';

import { logger } from '@utils/logger';
import { prisma } from '@server/db';
import { WEBHOOKS } from '@utils/webhooks';
import { updateAccountState } from '@webhooks/updateAccountState';
import { CampaignsService } from '@server/api/campaigns/campaigns.service';
import { emailApi } from '@utils/emailApi';
import { calcRate } from '@utils/calcRate';
import { baseUrl } from '@utils/baseUrl';

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
      const warmup = await prisma.warmup.findFirst({ where: { messageId: req.body.data.messageId } });
      const status: Record<string, ActivityStatus> = {
        [WEBHOOKS.TRACK_OPEN]: ActivityStatus.OPENED,
        [WEBHOOKS.MESSAGE_BOUNCE]: ActivityStatus.BOUNCED,
        [WEBHOOKS.MESSAGE_MISSING]: ActivityStatus.ERROR,
        [WEBHOOKS.MESSAGE_DELIVERY_ERROR]: ActivityStatus.ERROR,
        [WEBHOOKS.MESSAGE_FAILED]: ActivityStatus.ERROR,
      };
      const warmupStatus: Record<string, WarmupStatus> = {
        [WEBHOOKS.MESSAGE_BOUNCE]: WarmupStatus.BOUNCED,
        [WEBHOOKS.MESSAGE_MISSING]: WarmupStatus.ERROR,
        [WEBHOOKS.MESSAGE_DELIVERY_ERROR]: WarmupStatus.ERROR,
        [WEBHOOKS.MESSAGE_FAILED]: WarmupStatus.ERROR,
      };
      if (activity || warmup) {
        const createdActivity = await prisma.activity.create({
          data: {
            ...omit(activity, ['id', 'createdAt', 'updatedAt', 'queueId']),
            status: status[req.body.event as string],
          },
        });
        const createdWarmupActivity = await prisma.warmup.create({
          data: {
            ...omit(warmup, ['id', 'createdAt', 'updatedAt', 'queueId']),
            status: warmupStatus[req.body.event as string],
          },
        });
        const queuedActivity = await prisma.activity.findFirst({
          where: {
            messageId: createdActivity.messageId,
            status: ActivityStatus.QUEUED,
          },
        });
        const queuedWarmupActivity = await prisma.warmup.findFirst({
          where: {
            messageId: createdWarmupActivity.messageId,
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
        if (queuedWarmupActivity) {
          await prisma.activity.delete({
            where: {
              id: queuedWarmupActivity.id,
            },
          });
        }
      }
      break;
    }
    case WEBHOOKS.MESSAGE_NEW: {
      const {
        account,
        specialUse,
        data: { inReplyTo, labels, threadId, subject, text, seemsLikeNew, from, messageSpecialUse, id, date },
      } = req.body;
      if (inReplyTo && messageSpecialUse??.includes('Inbox')) {
        const activity = inReplyTo ? await prisma.activity.findFirst({ where: { messageId: inReplyTo } }) : null;
        const warmup = inReplyTo ? await prisma.warmup.findFirst({ where: { messageId: inReplyTo } }) : null;

        if (activity) {
          const { data: textData } = await emailApi.get(`/account/${account}/text/${text.id}`);
          const createdActivity = await prisma.activity.create({
            data: {
              ...omit(activity, ['id', 'createdAt', 'updatedAt', 'queueId']),
              status: ActivityStatus.REPLIED,
              threadId,
              subject,
              body: textData?.plain ? truncate(textData?.plain, { length: 150 }) : null,
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

        if (warmup) {
          const createdWarmupActivity = await prisma.warmup.create({
            data: {
              ...omit(warmup, ['id', 'createdAt', 'updatedAt', 'queueId']),
              status: WarmupStatus.REPLIED,
              threadId,
            },
          });
          const queuedWarmupActivity = await prisma.warmup.findFirst({
            where: {
              messageId: createdWarmupActivity.messageId,
              status: ActivityStatus.QUEUED,
            },
          });

          if (queuedWarmupActivity) {
            await prisma.activity.delete({
              where: {
                id: queuedWarmupActivity.id,
              },
            });
          }
        }
      }
      if (messageSpecialUse?.includes('Inbox') && seemsLikeNew) {
        const warmup = await prisma.warmup.findFirst({ where: { recipientAccountId: account } });
        if (warmup) {
          await prisma.warmup.create({
            data: {
              ...omit(warmup, ['id', 'createdAt', 'updatedAt', 'queueId']),
              status: WarmupStatus.INBOX,
            },
          });
        }
      }

      if ((specialUse?.includes('Junk') || labels?.includes('Junk')) && seemsLikeNew) {
        const warmup = await prisma.warmup.findFirst({ where: { recipientAccountId: account } });
        if (warmup) {
          await prisma.warmup.create({
            data: {
              ...omit(warmup, ['id', 'createdAt', 'updatedAt', 'queueId']),
              status: WarmupStatus.SPAM,
            },
          });
          await emailApi.put(`/account/${account}/message/${warmup.messageId}/move`, { path: 'INBOX' });
        }
      }

      if (messageSpecialUse?.includes('Inbox') && seemsLikeNew) {
        const senderId = await prisma.account.findUnique({ where: { email: from.address } });
        if (senderId) {
          const counts = await prisma.warmup.groupBy({
            where: { senderAccountId: senderId.id },
            by: ['status'],
            _count: true,
          });
          const sent = counts.find(item => item.status === 'SENT')?._count || 0;
          const replied = counts.find(item => item.status === 'REPLIED')?._count || 0;
          const replyRate = calcRate(replied, sent, false) as number;
          if (replyRate < 30) {
            const { data: textData } = await emailApi.get(`/account/${account}/text/${text.id}`);
            await axios.post(`${baseUrl}/api/reply-warmup-ai`, {
              messageText: textData.plain,
              messageId: id,
              date,
              account,
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
      const warmup = await prisma.warmup.findFirst({
        where: { messageId: req.body.data.messageId },
      });
      const sequences = activity?.campaign?.sequences as Prisma.JsonArray;
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

      if (warmup) {
        await prisma.warmup.create({
          data: {
            ...omit(warmup, ['id', 'createdAt', 'updatedAt', 'queueId']),
            status: WarmupStatus.SENT,
          },
        });
      }

      if (activity?.status === ActivityStatus.QUEUED) {
        await prisma.activity.delete({
          where: {
            id: activity.id,
          },
        });
      }
      if (warmup?.status === WarmupStatus.QUEUED) {
        await prisma.warmup.delete({
          where: {
            id: warmup.id,
          },
        });
      }
      break;
    }
  }

  res.status(200).json({ message: 'Webhook processed.' });
}
