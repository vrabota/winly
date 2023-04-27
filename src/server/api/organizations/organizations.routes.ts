import { createTRPCRouter, protectedProcedure } from '@server/api/trpc';

import { updateOrganizationSchema } from './organization.dto';
import { OrganizationsController } from './organizations.controller';

export const organizationRoutes = createTRPCRouter({
  getOrganizations: protectedProcedure.query(OrganizationsController.getOrganizationsHandler),
  updateOrganization: protectedProcedure
    .input(updateOrganizationSchema)
    .mutation(OrganizationsController.updateOrganizationHandler),
});
