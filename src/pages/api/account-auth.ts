import { prisma } from '@server/db';
import { oAuth2Client } from '@utils/authClient';
import { decrypt } from '@utils/crypto';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { account } = req.query;
  let payload;
  if (typeof account === 'string') {
    payload = await prisma.account.findUnique({ where: { id: account } });
  }

  if (!payload?.email && !payload?.refreshToken) {
    return res.status(400).json({ message: `Can't process the request for this account` });
  }

  oAuth2Client.setCredentials({ refresh_token: decrypt(payload.refreshToken) });
  const accessToken = await oAuth2Client.getAccessToken();

  return res.json({ user: payload.email, accessToken: accessToken.token });
}
