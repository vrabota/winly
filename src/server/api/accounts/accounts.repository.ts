import { prisma } from '@server/db';
import { logger } from '@utils/logger';

import { AccountsService } from './accounts.service';

import type { AccountDeleteOutput, AccountsInput } from '@server/api/accounts/accounts.dto';
import type { Prisma, Account } from '@prisma/client';

export class AccountsRepository {
  static async getAccounts(payload: AccountsInput): Promise<{
    items: Omit<Account, 'appPassword' | 'refreshToken' | 'addedById' | 'organizationId' | 'modifiedById'>[];
    nextCursor: string | undefined;
  }> {
    const accounts = await prisma.account.findMany({
      where: {
        organizationId: payload.organizationId,
        state: { in: payload.accountState },
        AND: [
          {
            OR: payload.search
              ? [
                  { firstName: { contains: payload.search } },
                  { lastName: { contains: payload.search } },
                  { email: { contains: payload.search } },
                ]
              : undefined,
          },
        ],
      },
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
      take: payload.limit ? payload.limit + 1 : undefined,
      cursor: payload.cursor ? { id: payload.cursor } : undefined,
    });

    let nextCursor: typeof payload.cursor | undefined = undefined;
    if (payload?.limit && accounts.length > payload?.limit) {
      const nextItem = accounts.pop(); // return the last item from the array
      nextCursor = nextItem?.id;
    }

    return { items: accounts, nextCursor };
  }

  static async createOrUpdateAccount(payload: Prisma.AccountUncheckedCreateInput): Promise<Account> {
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

  static async getAccountsByIds(payload: string[]): Promise<Account[]> {
    logger.info({ payload }, `Getting all accounts for specified ids`);

    const accounts = await prisma.account.findMany({
      where: { id: { in: payload } },
    });

    logger.info({ accounts, payload }, `Successfully return list of accounts for specified ids`);

    return accounts;
  }

  static async deleteAccount(accountId: string): Promise<AccountDeleteOutput> {
    logger.info(`Deleting account with id ${accountId}`);

    const deletedAccount = await prisma.$transaction(async prisma => {
      await prisma.account.delete({ where: { id: accountId } });
      return AccountsService.deleteAccountService(accountId);
    });

    logger.info(`Successfully deleted account id ${accountId}`);

    return deletedAccount;
  }
}
