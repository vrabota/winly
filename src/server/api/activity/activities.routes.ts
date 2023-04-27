import { createTRPCRouter, protectedProcedure } from '@server/api/trpc';

import { getActivitiesSchema } from './activity.dto';
import { ActivityController } from './activities.controller';

export const activitiesRoutes = createTRPCRouter({
  getActivities: protectedProcedure.input(getActivitiesSchema).query(ActivityController.getActivitiesHandler),
  getActivitiesStats: protectedProcedure.input(getActivitiesSchema).query(ActivityController.getActivitiesStatsHandler),
  getActivitiesByStep: protectedProcedure
    .input(getActivitiesSchema)
    .query(ActivityController.getActivitiesByStepHandler),
});
