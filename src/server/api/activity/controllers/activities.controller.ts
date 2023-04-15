import { getActivitiesRepository, ActivityRepository } from '@server/api/activity/data/repositories';

import type { GetActivitiesInput } from '@server/api/activity/data/dtos';

export const getActivitiesHandler = async ({ input }: { input: GetActivitiesInput }) => {
  return getActivitiesRepository(input);
};
export const getActivitiesStatsHandler = async ({ input }: { input: GetActivitiesInput }) => {
  return ActivityRepository.getActivitiesStats(input);
};
export const getActivitiesByStepHandler = async ({ input }: { input: GetActivitiesInput }) => {
  return ActivityRepository.getActivitiesByStep(input);
};
