import { ActivityStatus, Prisma } from '@prisma/client';

import { prisma } from '@server/db';
import { logger } from '@utils/logger';
import { DateRanges } from '@features/campaigns/utils';
import { getPeriodDates } from '@utils/period';

import { AccountsService } from './accounts.service';

import type { AccountDeleteOutput, AccountsInput } from '@server/api/accounts/accounts.dto';
import type { Account } from '@prisma/client';

type AccountItem = Omit<
  Account,
  | 'appPassword'
  | 'refreshToken'
  | 'addedById'
  | 'organizationId'
  | 'modifiedById'
  | 'code'
  | 'replyRate'
  | 'dailyMaxLimit'
  | 'currentMaxLimit'
  | 'stepLimit'
>;

export class AccountsRepository {
  static async getAccounts(payload: AccountsInput): Promise<{
    items: (AccountItem & { stats?: any })[];
    nextCursor: string | undefined;
  }> {
    let accountDayActivitiesStats: any;
    let warmupActivitiesStats: any;
    let accountsWithStats: (AccountItem & { stats: any })[] = [];

    const allAccounts = await prisma.account.findMany({
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
        warmupState: true,
      },
      take: payload.limit ? payload.limit + 1 : undefined,
      cursor: payload.cursor ? { id: payload.cursor } : undefined,
    });

    if (payload.withStats) {
      accountDayActivitiesStats = await prisma.$queryRaw<any[]>`
    SELECT status, account_id , COUNT(DISTINCT message_id) as _count
    FROM activities AS a
    WHERE
    ${payload.organizationId ? Prisma.sql`organization_id = ${payload.organizationId} AND` : Prisma.empty}
    -- ${Prisma.sql`DATE(created_at) = CURDATE() AND`}
    ${Prisma.sql`status = ${ActivityStatus.CONTACTED}`}
    GROUP BY 1, 2;`;

      const warmupActivities = await prisma.warmup.groupBy({
        where: {
          organizationId: payload.organizationId,
          createdAt: { gte: getPeriodDates(DateRanges.Week)[0], lte: getPeriodDates(DateRanges.Week)[1] },
        },
        by: ['status', 'senderAccountId'],
        _count: true,
      });

      warmupActivitiesStats = warmupActivities.map(activity => ({
        _count: activity._count,
        account_id: activity.senderAccountId,
        status: activity.status,
      }));

      accountsWithStats = allAccounts.map(account => ({
        ...account,
        stats: Object.fromEntries(
          [...warmupActivitiesStats, ...accountDayActivitiesStats]
            .filter(item => item.account_id === account.id)
            .map(activity => [
              activity.status,
              {
                accountId: activity.account_id,
                _count: typeof activity._count === 'bigint' ? parseInt(activity._count) : activity._count,
              },
            ]),
        ),
      }));
    }

    console.log(accountDayActivitiesStats, 'accountDayActivitiesStats');
    console.log(warmupActivitiesStats, 'warmupActivities');
    console.log(accountsWithStats, 'accountsWithStats');

    const accounts = payload.withStats ? accountsWithStats : allAccounts;

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
