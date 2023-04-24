import { Service } from 'typedi';

import { prisma } from '@server/db';

import type { withOrgId } from '@server/types/withUserOrgIds';
import type { UpdateOrganizationInput } from './organization.dto';
import type { Organization } from '@prisma/client';

@Service()
export class OrganizationsRepository {
  async getUserOrganizations(userId?: string): Promise<Organization[]> {
    return prisma.organization.findMany({ where: { users: { every: { id: userId } } } });
  }

  async updateOrganization(payload: withOrgId<UpdateOrganizationInput>): Promise<Organization> {
    return prisma.organization.update({
      where: {
        id: payload.organizationId,
      },
      data: {
        name: payload.name,
      },
    });
  }
}
