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
  }

  res.status(200).json(payload);
}
