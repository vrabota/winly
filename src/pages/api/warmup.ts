import { logger } from '@utils/logger';

import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.query.key !== process.env.VERCEL_CRON_SECRET) {
    logger.warn('Cannot trigger the scheduler, wrong key provided');
    response.status(404).end();
    return;
  }

  logger.info('Warmup scheduler triggered');

  response.status(200).json({ success: true });
}
