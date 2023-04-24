import { Container, Service } from 'typedi';

import { prisma } from '@server/db';
import { logger } from '@utils/logger';

import { AccountsService } from './accounts.service';

import type { AccountDeleteOutput, AccountsInput } from '@server/api/accounts/accounts.dto';
import type { Prisma, Account } from '@prisma/client';

@Service()
export class AccountsRepository {
  async getAccounts(
    payload: AccountsInput,
  ): Promise<Omit<Account, 'appPassword' | 'refreshToken' | 'addedById' | 'organizationId' | 'modifiedById'>[]> {
    logger.info({ payload }, `Getting all accounts`);

    const accounts = await prisma.account.findMany({
      where: { organizationId: payload.organizationId },
      select: {
        state: true,
        picture: true,
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        updatedAt: true,
        createdAt: true,
        type: true,
      },
    });

    logger.info({ accounts }, `Successfully return list of accounts`);

    return accounts;
  }

  async createOrUpdateAccount(payload: Prisma.AccountUncheckedCreateInput): Promise<Account> {
    logger.info({ payload }, `Creating or Updating an account in DB with email ${payload.email}`);

    const createdAccount = await prisma.account.upsert({
      where: { email: payload.email },
      update: payload,
      create: payload,
    });

    logger.info(
      { payload },
      `Successfully created or updated account with id ${createdAccount.id} and email ${createdAccount.email}`,
    );

    return createdAccount;
  }

  async getAccountsByIds(payload: string[]): Promise<Account[]> {
    logger.info({ payload }, `Getting all accounts for specified ids`);

    const accounts = await prisma.account.findMany({
      where: { id: { in: payload } },
    });

    logger.info({ accounts, payload }, `Successfully return list of accounts for specified ids`);

    return accounts;
  }

  async deleteAccount(accountId: string): Promise<AccountDeleteOutput> {
    const accountsService = Container.get(AccountsService);

    logger.info(`Deleting account with id ${accountId}`);

    const deletedAccount = await prisma.$transaction(async prisma => {
      await prisma.account.delete({ where: { id: accountId } });
      return accountsService.deleteAccountService(accountId);
    });

    logger.info(`Successfully deleted account id ${accountId}`);

    return deletedAccount;
  }
}
