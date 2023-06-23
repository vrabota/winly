import { WarmupStatus } from '@prisma/client';

import { logger } from '@utils/logger';
import { prisma } from '@server/db';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.query.key !== process.env.VERCEL_CRON_SECRET) {
    logger.warn('Cannot trigger the scheduler, wrong key provided');
    res.status(404).end();
    return;
  }

  logger.info('Createing queued activity for warmup service');

  const { messageId, queueId, accountId, organizationId, recipientEmail } = req.body;

  const warmup = await prisma.$transaction(async prisma => {
    const recipientAccount = await prisma.account.findUniqueOrThrow({ where: { email: recipientEmail } });

    return prisma.warmup.create({
      data: {
        status: WarmupStatus.QUEUED,
        senderAccountId: accountId,
        recipientAccountId: recipientAccount.id,
        queueId,
        messageId,
        organizationId,
      },
    });
  });

  logger.info({ warmup }, 'Successful create queued activity for warmup service');
  res.json({ message: 'Queued for delivery' });
}
