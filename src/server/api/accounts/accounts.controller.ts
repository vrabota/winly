import { Container, Service } from 'typedi';
import { AccountType } from '@prisma/client';

import { logger } from '@utils/logger';

import { AccountsRepository } from './accounts.repository';
import { AccountsService } from './accounts.service';

import type { AccountIdInput, AppPasswordAccountInput, Oauth2AccountInput } from '@server/api/accounts/accounts.dto';
import type { Context } from '@server/api/trpc';

@Service()
export class AccountsController {
  async getAll({ ctx }: { ctx: Context }) {
    const accountsRepository = Container.get(AccountsRepository);

    const accounts = await accountsRepository.getAccounts({ organizationId: ctx.organizationId });

    logger.info({ accounts }, `Successfully received list of accounts`);

    return accounts;
  }

  async connectGoogleOauthHandler({ input, ctx }: { input: Oauth2AccountInput; ctx: Context }) {
    const accountsRepository = Container.get(AccountsRepository);
    const accountsService = Container.get(AccountsService);

    const oauth2Account = await accountsService.oauth2AccountService(input.code);

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

    const createdAccount = await accountsRepository.createOrUpdateAccount(payload);
    const connectedAccount = await accountsService.connectAccountService(createdAccount, payload.type);

    logger.info({ payload: connectedAccount }, `Account ${createdAccount.id} was created and connected successfully.`);

    return connectedAccount;
  }

  async connectGoogleAppPasswordHandler({ input, ctx }: { input: AppPasswordAccountInput; ctx: Context }) {
    const accountsRepository = Container.get(AccountsRepository);
    const accountsService = Container.get(AccountsService);

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

    const createdAccount = await accountsRepository.createOrUpdateAccount(payload);
    const connectedAccount = await accountsService.connectAccountService(createdAccount, payload.type);

    logger.info({ payload: connectedAccount }, `Account ${createdAccount.id} was created and connected successfully.`);

    return connectedAccount;
  }

  async reconnectAccountHandler({ input }: { input: AccountIdInput }) {
    const accountsService = Container.get(AccountsService);

    const account = await accountsService.reconnectAccountsService(input.accountId);

    logger.info({ account }, `Successfully reconnected account ${input.accountId}`);

    return account;
  }

  async deleteAccountHandler({ input }: { input: AccountIdInput }) {
    const accountsRepository = Container.get(AccountsRepository);

    const deletedAccount = await accountsRepository.deleteAccount(input.accountId);

    logger.info({ deletedAccount }, `Successfully reconnected account ${input.accountId}`);

    return deletedAccount;
  }
}
