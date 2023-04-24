import { Container } from 'typedi';

import { createTRPCRouter, protectedProcedure } from '@server/api/trpc';

import { updateOrganizationSchema } from './organization.dto';
import { OrganizationsController } from './organizations.controller';

const organizationsController = Container.get(OrganizationsController);

export const organizationRoutes = createTRPCRouter({
  getOrganizations: protectedProcedure.query(organizationsController.getOrganizationsHandler),
  updateOrganization: protectedProcedure
    .input(updateOrganizationSchema)
    .mutation(organizationsController.updateOrganizationHandler),
});
