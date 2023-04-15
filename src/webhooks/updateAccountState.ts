import { prisma } from '@server/db';

import type { Account, AccountState } from '@prisma/client';

export const updateAccountState = async ({
  accountId,
  state,
}: {
  accountId: string;
  state: AccountState;
}): Promise<Account> => {
  return prisma.account.update({ where: { id: accountId }, data: { state } });
};
