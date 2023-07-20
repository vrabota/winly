import { logger } from '@utils/logger';
import { prisma } from '@server/db';
import enableWarmup from 'defer/enableWarmup';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.query.key !== process.env.VERCEL_CRON_SECRET) {
    logger.warn('Cannot trigger the scheduler, wrong key provided');
    response.status(404).end();
    return;
  }

  logger.info('Warmup scheduler triggered');

  const warmupAccounts = await prisma.account.findMany({
    where: {
      warmupState: true,
    },
  });

  logger.info('Warmup scheduler triggered for accounts', { accounts: warmupAccounts.map(account => account.id) });

  await enableWarmup(warmupAccounts);

  logger.info('Warmup defer function executed for accounts', { accounts: warmupAccounts.map(account => account.id) });

  response.status(200).json({ success: true });
}
