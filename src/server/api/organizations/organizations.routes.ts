import { createTRPCRouter, protectedProcedure } from '@server/api/trpc';
import { getOrganizationsHandler, updateOrganizationHandler } from '@server/api/organizations/controllers';
import { updateOrganizationSchema } from '@server/api/organizations/data/dtos';

export const organizationRoutes = createTRPCRouter({
  getOrganizations: protectedProcedure.query(getOrganizationsHandler),
  updateOrganization: protectedProcedure.input(updateOrganizationSchema).mutation(updateOrganizationHandler),
});
