import { ActivityStatus } from '@prisma/client';
import omit from 'lodash/omit';

import { logger } from '@utils/logger';
import { prisma } from '@server/db';
import { WEBHOOKS } from '@utils/webhooks';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  logger.info({ webhook: req.body }, `Webhook event`);
  let payload;

  switch (req.body.event) {
    case WEBHOOKS.ACCOUNT_DELETED: {
      payload = await prisma.account.delete({ where: { id: req.body.account } });
      logger.info({ webhook: req.body, payload }, `Successful webhook event ${WEBHOOKS.ACCOUNT_DELETED} executed`);
      break;
    }
    case WEBHOOKS.TRACK_OPEN: {
      const activity = await prisma.activity.findFirst({ where: { messageId: req.body.data.messageId } });
      if (activity) {
        payload = await prisma.activity.create({
          data: { ...omit(activity, ['id', 'createdAt', 'updatedAt', 'queueId']), status: ActivityStatus.OPENED },
        });
      }
      break;
    }
    case WEBHOOKS.MESSAGE_NEW: {
      const {
        specialUse,
        data: { inReplyTo, labels },
      } = req.body;
      if ((inReplyTo && specialUse.includes('All')) || labels.includes('\\Inbox')) {
        const activity = await prisma.activity.findFirst({ where: { messageId: inReplyTo } });
        if (activity) {
          const createdActivity = await prisma.activity.create({
            data: { ...omit(activity, ['id', 'createdAt', 'updatedAt', 'queueId']), status: ActivityStatus.REPLIED },
            select: {
              campaign: true,
            },
          });

          if (createdActivity.campaign.sendOnReply) {
            //find all queueId for this lead and remove them
          }
        }
      }
      break;
    }
  }

  res.status(200).json({ message: 'Webhook processed.' });
}
