import { createTRPCRouter, protectedProcedure } from '@server/api/trpc';
import { getOrganizationsHandler } from '@server/api/organizations/controllers';

export const organizationRoutes = createTRPCRouter({
  getOrganizations: protectedProcedure.query(getOrganizationsHandler),
});
