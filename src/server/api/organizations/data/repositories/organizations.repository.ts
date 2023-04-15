import { prisma } from '@server/db';
import { logger } from '@utils/logger';

import type { withOrgId } from '@server/types/withUserOrgIds';
import type { UpdateOrganizationInput } from '@server/api/organizations/data/dtos';
import type { Organization } from '@prisma/client';

export const getUserOrganizations = async (userId?: string): Promise<Organization[]> => {
  logger.info(`Requesting list of all organizations for user ${userId}`);

  const organizations = await prisma.organization.findMany({ where: { users: { every: { id: userId } } } });

  logger.info({ organizations }, `Successfully found list of all organizations for user ${userId}`);

  return organizations;
};

export const updateOrganization = async (payload: withOrgId<UpdateOrganizationInput>): Promise<Organization> => {
  logger.info(`Updating organization ${payload.organizationId} with name ${payload.name}`);

  const updatedOrganization = await prisma.organization.update({
    where: {
      id: payload.organizationId,
    },
    data: {
      name: payload.name,
    },
  });

  logger.info(`Successfully updated organization ${payload.organizationId} with name ${payload.name}`);

  return updatedOrganization;
};
