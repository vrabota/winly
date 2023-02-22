import { TRPCError } from '@trpc/server';
import { AccountType } from '@prisma/client';

import { logger } from '@utils/logger';
import { emailApi } from '@utils/emailApi';
import { oAuth2Client } from '@utils/authClient';
import { encrypt } from '@utils/crypto';

import type { Account } from '@prisma/client';
import type { AccountsListOutput } from '@server/api/accounts/data/dtos/accounts.dto';

export const oauth2AccountService = async (code: string): Promise<{ email: string; refreshToken: string }> => {
  logger.info(`Connecting Google Account based with ${code} code`);

  const { tokens } = await oAuth2Client.getToken(code);
  const refreshToken = encrypt(tokens.refresh_token as string);

  logger.info({ tokens }, `Exchange code for tokens`);

  oAuth2Client.setCredentials(tokens);

  const { email } = await oAuth2Client.getTokenInfo(tokens.access_token as string);

  logger.info({ email }, `Receive email from access token`);

  if (!email || !refreshToken) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Can not receive email and token for this request' });
  }
  return { email, refreshToken };
};

export const connectAccountService = async (account: Account, type: AccountType) => {
  try {
    const appPasswordAuth = {
      user: account.email,
      pass: account.appPassword,
    };
    const emailPayload = {
      account: account.id,
      name: account.email,
      email: account.email,
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
};

export const getAccountsService = async (): Promise<AccountsListOutput> => {
  try {
    const { data } = await emailApi.get('/accounts?page=0');
    return data;
  } catch (error) {
    logger.info({ error }, `Can not return list of accounts from Email Engine service.`);

    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `Unfortunately can not return accounts from service.`,
      cause: error,
    });
  }
};
