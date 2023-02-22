import * as crypto from 'crypto';

import { logger } from '@utils/logger';
import { prisma } from '@server/db';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  logger.info({ body: req.body.data, headers: req.headers }, `Post login action`);

  const signatureHeader = 'x-signature';
  const signatureAlgorithm = 'sha256';
  const encodeFormat = 'hex';
  const hmacSecret = process.env.AUTH0_WEBHOOK_SECRET as string;
  const hashPayload = JSON.stringify(req.body.data);
  const hmac = crypto.createHmac(signatureAlgorithm, hmacSecret);
  const digest = Buffer.from(hmac.update(hashPayload).digest(encodeFormat), 'utf-8');
  const providerSignHeader = req.headers?.[signatureHeader] || '';
  const providerSign = Buffer.from(providerSignHeader as string, 'utf8');

  if (providerSign.length !== digest.length || !crypto.timingSafeEqual(digest, providerSign)) {
    logger.error({ body: req.body.data, headers: req.headers }, `Unauthorized: Post login action`);
    res.status(401).send('Unauthorized');
  } else {
    logger.info({ data: req.body.data, headers: req.headers }, `Success: Post login action`);

    const { isSocial, provider } = req.body.data.identities[0];
    const { email, family_name, given_name, picture, user_id: userId } = req.body.data;
    const payload = {
      auth0Id: userId,
      firstName: given_name,
      lastName: family_name,
      provider,
      isSocial,
      email,
      picture,
    };

    const userById = await prisma.user.findUnique({ where: { auth0Id: userId } });

    if (!userById) {
      const createdUser = await prisma.user.create({
        data: payload,
      });
      const createdOrganization = await prisma.organization.create({
        data: {
          users: { connect: { id: createdUser.id } },
          ownerId: createdUser.id,
        },
      });
      logger.info(
        { data: { createdUser, createdOrganization } },
        `Successfully created account with id ${userId} and email ${email}`,
      );
    }
    res.json({ message: 'Success' });
  }
}
