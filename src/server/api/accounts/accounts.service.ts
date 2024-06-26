import { TRPCError } from '@trpc/server';
import { AccountType } from '@prisma/client';

import { logger } from '@utils/logger';
import { emailApi } from '@utils/emailApi';
import { oAuth2Client } from '@utils/authClient';
import { encrypt } from '@utils/crypto';

import type { AccountDeleteOutput, AccountReconnectOutput } from './accounts.dto';
import type { Account } from '@prisma/client';

interface GoogleOauth {
  email: string;
  refreshToken: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
}

export class AccountsService {
  static async oauth2AccountService(code: string): Promise<GoogleOauth> {
    logger.info(`Connecting Google Account based with ${code} code`);

    const { tokens } = await oAuth2Client.getToken(code);
    const refreshToken = encrypt(tokens.refresh_token as string);

    logger.info({ tokens }, `Exchange code for tokens`);

    oAuth2Client.setCredentials(tokens);

    const { email } = await oAuth2Client.getTokenInfo(tokens.access_token as string);
    const response = await oAuth2Client.verifyIdToken({ idToken: tokens.id_token as string });
    const { given_name, family_name, picture } = response.getPayload() || {};

    logger.info({ email }, `Receive email from access token`);

    if (!email || !refreshToken) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Can not receive email and token for this request' });
    }
    return { email, refreshToken, given_name, family_name, picture };
  }

  static async connectAccountService(account: Account, type: AccountType) {
    try {
      const appPasswordAuth = {
        user: account.email,
        pass: account.appPassword,
      };
      const emailPayload = {
        account: account.id,
        name: account.email,
        email: account.email,
        syncFrom: new Date().toISOString(),
        imap: {
          useAuthServer: type === AccountType.GOOGLE_OAUTH || undefined,
          auth: type === AccountType.GOOGLE_APP_PASSWORD ? appPasswordAuth : undefined,
          host: 'imap.gmail.com',
          port: 993,
          secure: true,
        },
        smtp: {
          useAuthServer: type === AccountType.GOOGLE_OAUTH || undefined,
          auth: type === AccountType.GOOGLE_APP_PASSWORD ? appPasswordAuth : undefined,
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
        },
      };

      logger.info({ payload: emailPayload }, `Creating an account in Email Engine system`);

      const { data } = await emailApi.post('/account', emailPayload);

      return data;
    } catch (error) {
      logger.info({ error }, `Can't create and sync account ${account.id} with Email Engine service`);

      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Unfortunately can not connect the account to EmailEngine server.`,
        cause: error,
      });
    }
  }

  static async reconnectAccountsService(accountId: string): Promise<AccountReconnectOutput> {
    try {
      const { data } = await emailApi.put(`/account/${accountId}/reconnect`, { reconnect: true });
      return data;
    } catch (error) {
      logger.info({ error }, `Can not reconnect account from Email Engine service.`);

      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Unfortunately can not return reconnect account from service.`,
        cause: error,
      });
    }
  }

  static async deleteAccountService(accountId: string): Promise<AccountDeleteOutput> {
    const { data } = await emailApi.delete(`/account/${accountId}`);
    return data;
  }
}
