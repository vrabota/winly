import { prisma } from '@server/db';
import { logger } from '@utils/logger';

import type { Prisma, Account } from '@prisma/client';

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
