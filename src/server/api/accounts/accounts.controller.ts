import { AccountType } from '@prisma/client';

import { logger } from '@utils/logger';

import { AccountsRepository } from './accounts.repository';
import { AccountsService } from './accounts.service';

import type {
  AccountIdInput,
  AppPasswordAccountInput,
  Oauth2AccountInput,
  AccountsInput,
} from '@server/api/accounts/accounts.dto';
import type { Context } from '@server/api/trpc';

export class AccountsController {
  static async getAll({ input }: { ctx: Context; input: AccountsInput }) {
    const accounts = await AccountsRepository.getAccounts(input);

    logger.info({ accounts }, `Successfully received list of accounts`);

    return accounts;
  }

  static async connectGoogleOauthHandler({ input, ctx }: { input: Oauth2AccountInput; ctx: Context }) {
    const oauth2Account = await AccountsService.oauth2AccountService(input.code);

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

    const createdAccount = await AccountsRepository.createOrUpdateAccount(payload);
    const connectedAccount = await AccountsService.connectAccountService(createdAccount, payload.type);

    logger.info({ payload: connectedAccount }, `Account ${createdAccount.id} was created and connected successfully.`);

    return connectedAccount;
  }

  static async connectGoogleAppPasswordHandler({ input, ctx }: { input: AppPasswordAccountInput; ctx: Context }) {
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

    const createdAccount = await AccountsRepository.createOrUpdateAccount(payload);
    const connectedAccount = await AccountsService.connectAccountService(createdAccount, payload.type);

    logger.info({ payload: connectedAccount }, `Account ${createdAccount.id} was created and connected successfully.`);

    return connectedAccount;
  }

  static async reconnectAccountHandler({ input }: { input: AccountIdInput }) {
    const account = await AccountsService.reconnectAccountsService(input.accountId);

    logger.info({ account }, `Successfully reconnected account ${input.accountId}`);

    return account;
  }

  static async deleteAccountHandler({ input }: { input: AccountIdInput }) {
    const deletedAccount = await AccountsRepository.deleteAccount(input.accountId);

    logger.info({ deletedAccount }, `Successfully reconnected account ${input.accountId}`);

    return deletedAccount;
  }
}
