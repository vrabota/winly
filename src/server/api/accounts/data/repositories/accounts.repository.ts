import { prisma } from '@server/db';
import { logger } from '@utils/logger';

import type { Prisma, Account } from '@prisma/client';
import { AccountsInput } from '@server/api/accounts/data/dtos/accounts.dto';

export const createOrUpdateAccount = async (payload: Prisma.AccountUncheckedCreateInput): Promise<Account> => {
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
};

export const getAccountsByIds = async (payload: string[]): Promise<Account[]> => {
  logger.info({ payload }, `Getting all accounts for specified ids`);

  const accounts = await prisma.account.findMany({
    where: { id: { in: payload } },
  });

  logger.info({ accounts, payload }, `Successfully return list of accounts for specified ids`);

  return accounts;
};

export const getAccounts = async (
  payload: AccountsInput,
): Promise<Omit<Account, 'appPassword' | 'refreshToken' | 'addedById' | 'organizationId' | 'modifiedById'>[]> => {
  logger.info({ payload }, `Getting all accounts`);

  const accounts = await prisma.account.findMany({
    where: { organizationId: payload.organizationId },
    select: {
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
};
