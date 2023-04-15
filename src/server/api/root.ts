import { leadsRoutes } from '@server/api/leads/leads.routes';

import { createTRPCRouter } from './trpc';
import { accountsRoutes } from './accounts/accounts.routes';
import { organizationRoutes } from './organizations/organizations.routes';
import { campaignRoutes } from './campaigns/campaigns.routes';
import { infoRoutes } from './info/info.routes';
import { activitiesRoutes } from './activity/activities.routes';

export const appRouter = createTRPCRouter({
  account: accountsRoutes,
  organization: organizationRoutes,
  campaign: campaignRoutes,
  leads: leadsRoutes,
  info: infoRoutes,
  activity: activitiesRoutes,
});

export type AppRouter = typeof appRouter;
