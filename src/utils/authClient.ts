import { OAuth2Client } from 'google-auth-library';

export const oAuth2Client = new OAuth2Client({
  clientId: process.env.OAUTH2_CLIENT_ID,
  clientSecret: process.env.OAUTH2_CLIENT_SECRET,
  redirectUri: 'http://localhost:3000',
});
