import { leadsRoutes } from '@server/api/leads/leads.routes';

import { createTRPCRouter } from './trpc';
import { accountsRoutes } from './accounts/accounts.routes';
import { organizationRoutes } from './organizations/organizations.routes';
import { campaignRoutes } from './campaigns/campaigns.routes';

export const appRouter = createTRPCRouter({
  account: accountsRoutes,
  organization: organizationRoutes,
  campaign: campaignRoutes,
  leads: leadsRoutes,
});

export type AppRouter = typeof appRouter;
