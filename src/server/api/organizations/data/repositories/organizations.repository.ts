import { prisma } from '@server/db';
import { logger } from '@utils/logger';

import type { Organization } from '@prisma/client';

export const getUserOrganizations = async (userId?: string): Promise<Organization[]> => {
  logger.info(`Requesting list of all organizations for user ${userId}`);

  const organizations = await prisma.organization.findMany({ where: { users: { every: { id: userId } } } });

  logger.info({ organizations }, `Successfully found list of all organizations for user ${userId}`);

  return organizations;
};
