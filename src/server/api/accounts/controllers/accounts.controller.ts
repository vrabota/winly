import { TRPCError } from '@trpc/server';
import { AccountType } from '@prisma/client';

import { logger } from '@utils/logger';

import { createOrUpdateAccount } from '../data/repositories';
import { oauth2AccountService, connectAccountService, getAccountsService } from '../data/services';

import type { AppPasswordAccountInput } from '@server/api/accounts/data/dtos/accounts.dto';
import type { Context } from '@server/api/trpc';
import type { Oauth2AccountInput } from '../data/dtos';

export const connectGoogleOauthHandler = async ({ input, ctx }: { input: Oauth2AccountInput; ctx: Context }) => {
  try {
    const oauth2Account = await oauth2AccountService(input.code);

    const payload = {
      refreshToken: oauth2Account.refreshToken,
      organizationId: ctx.organizationId,
      addedById: ctx.user.id,
      modifiedById: ctx.user.id,
      email: oauth2Account.email,
      type: AccountType.GOOGLE_OAUTH,
    };

    const createdAccount = await createOrUpdateAccount(payload);
    const connectedAccount = await connectAccountService(createdAccount, payload.type);

    logger.info({ payload: connectedAccount }, `Account ${createdAccount.id} was created and connected successfully.`);

    return connectedAccount;
  } catch (error) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `Unfortunately can not create and connect the account.`,
      cause: error,
    });
  }
};

export const connectGoogleAppPasswordHandler = async ({
  input,
  ctx,
}: {
  input: AppPasswordAccountInput;
  ctx: Context;
}) => {
  try {
    const payload = {
      appPassword: input.appPassword,
      firstName: input.firstName,
      lastName: input.lastName,
      organizationId: ctx.organizationId,
      addedById: ctx.user.id as string,
      modifiedById: ctx.user?.id as string,
      email: input.email,
      type: AccountType.GOOGLE_APP_PASSWORD,
    };

    const createdAccount = await createOrUpdateAccount(payload);
    const connectedAccount = await connectAccountService(createdAccount, payload.type);

    logger.info({ payload: connectedAccount }, `Account ${createdAccount.id} was created and connected successfully.`);

    return connectedAccount;
  } catch (error) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `Unfortunately can not create and connect the account.`,
      cause: error,
    });
  }
};

export const getAccountsHandler = async () => {
  const accounts = await getAccountsService();

  logger.info({ accounts }, `Successfully received list of accounts`);

  return accounts;
};
