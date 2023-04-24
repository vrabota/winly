import { Container, Service } from 'typedi';

import { logger } from '@utils/logger';

import { OrganizationsRepository } from './organizations.repository';

import type { UpdateOrganizationInput } from './organization.dto';
import type { Context } from '@server/api/trpc';

@Service()
export class OrganizationsController {
  async getOrganizationsHandler({ ctx }: { ctx: Context }) {
    logger.info(`Requesting list of all organizations for user ${ctx.user.id}`);

    const organizationsRepository = Container.get(OrganizationsRepository);
    const organizations = await organizationsRepository.getUserOrganizations(ctx.user?.id);

    logger.info({ organizations }, `Successfully found list of all organizations for user ${ctx.user?.id}`);

    return organizations;
  }

  async updateOrganizationHandler({ ctx, input }: { ctx: Context; input: UpdateOrganizationInput }) {
    logger.info(`Updating organization ${ctx.organizationId} with name ${input.name}`);

    const organizationsRepository = Container.get(OrganizationsRepository);
    const updatedOrganization = await organizationsRepository.updateOrganization({
      organizationId: ctx.organizationId,
      name: input.name,
    });

    logger.info(`Successfully updated organization ${ctx.organizationId} with name ${input.name}`);

    return updatedOrganization;
  }
}
