import { Container } from 'typedi';

import { createTRPCRouter, protectedProcedure } from '@server/api/trpc';

import { getActivitiesSchema } from './activity.dto';
import { ActivityController } from './activities.controller';

const activityController = Container.get(ActivityController);

export const activitiesRoutes = createTRPCRouter({
  getActivities: protectedProcedure.input(getActivitiesSchema).query(activityController.getActivitiesHandler),
  getActivitiesStats: protectedProcedure.input(getActivitiesSchema).query(activityController.getActivitiesStatsHandler),
  getActivitiesByStep: protectedProcedure
    .input(getActivitiesSchema)
    .query(activityController.getActivitiesByStepHandler),
});
