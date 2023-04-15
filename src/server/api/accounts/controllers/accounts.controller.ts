import { TRPCError } from '@trpc/server';
import { AccountType } from '@prisma/client';

import { logger } from '@utils/logger';

import { createOrUpdateAccount, getAccounts, deleteAccount } from '../data/repositories';
import { oauth2AccountService, connectAccountService, reconnectAccountsService } from '../data/services';

import type { AccountIdInput, AppPasswordAccountInput } from '@server/api/accounts/data/dtos/accounts.dto';
import type { Context } from '@server/api/trpc';
import type { Oauth2AccountInput } from '../data/dtos';

export const connectGoogleOauthHandler = async ({ input, ctx }: { input: Oauth2AccountInput; ctx: Context }) => {
  try {
    const oauth2Account = await oauth2AccountService(input.code);

    const payload = {
      firstName: oauth2Account?.given_name,
      lastName: oauth2Account?.family_name,
      picture: oauth2Account?.picture,
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

export const getAccountsHandler = async ({ ctx }: { ctx: Context }) => {
  const accounts = await getAccounts({ organizationId: ctx.organizationId });

  logger.info({ accounts }, `Successfully received list of accounts`);

  return accounts;
};

export const reconnectAccountHandler = async ({ input }: { input: AccountIdInput }) => {
  const account = await reconnectAccountsService(input.accountId);

  logger.info({ account }, `Successfully reconnected account ${input.accountId}`);

  return account;
};

export const deleteAccountHandler = async ({ input }: { input: AccountIdInput }) => {
  const deletedAccount = await deleteAccount(input.accountId);

  logger.info({ deletedAccount }, `Successfully reconnected account ${input.accountId}`);

  return deletedAccount;
};
