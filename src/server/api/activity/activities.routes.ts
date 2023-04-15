import { getActivitiesSchema } from '@server/api/activity/data/dtos';
import {
  getActivitiesByStepHandler,
  getActivitiesHandler,
  getActivitiesStatsHandler,
} from '@server/api/activity/controllers';
import { createTRPCRouter, protectedProcedure } from '@server/api/trpc';

export const activitiesRoutes = createTRPCRouter({
  getActivities: protectedProcedure.input(getActivitiesSchema).query(getActivitiesHandler),
  getActivitiesStats: protectedProcedure.input(getActivitiesSchema).query(getActivitiesStatsHandler),
  getActivitiesByStep: protectedProcedure.input(getActivitiesSchema).query(getActivitiesByStepHandler),
});
