import { withApiAuthRequired } from '@auth0/nextjs-auth0';

import { oAuth2Client } from '@utils/authClient';
import { logger } from '@utils/logger';

import type { NextApiRequest, NextApiResponse } from 'next';

export default withApiAuthRequired(function handler(req: NextApiRequest, res: NextApiResponse) {
  logger.info('Generate google OAuth2 URL for client');

  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent', // can be disabled after store refresh_token in DB
    scope: [
      'https://mail.google.com',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });

  logger.info({ url: authorizeUrl }, 'Successful generated google oauth2 URL for client');
  res.redirect(authorizeUrl);
});
