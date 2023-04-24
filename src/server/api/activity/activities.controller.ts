import { Container, Service } from 'typedi';

import { logger } from '@utils/logger';

import { ActivityRepository } from './activity.repository';

import type { GetActivitiesInput } from './activity.dto';

@Service()
export class ActivityController {
  async getActivitiesHandler({ input }: { input: GetActivitiesInput }) {
    logger.info({ input }, `Getting list of activities for campaign ${input.campaignId}.`);

    const activityRepository = Container.get(ActivityRepository);
    const activities = await activityRepository.getAll(input);

    logger.info({ activities }, `Successfully returned list of activities for campaign ${input.campaignId}.`);

    return activities;
  }
  async getActivitiesStatsHandler({ input }: { input: GetActivitiesInput }) {
    logger.info({ input }, `Getting list of activities grouped by date and status.`);

    const activityRepository = Container.get(ActivityRepository);
    const activities = await activityRepository.getActivitiesByDateAndStatus(input);

    logger.info({ activities }, `Successfully returned list of activities grouped by date and status.`);

    return activities;
  }
  async getActivitiesByStepHandler({ input }: { input: GetActivitiesInput }) {
    logger.info({ input }, `Getting list of activities for campaign ${input.campaignId} grouped by step.`);

    const activityRepository = Container.get(ActivityRepository);
    const activities = await activityRepository.getActivitiesByStep(input);

    logger.info(
      { activities },
      `Successfully returned list of activities for campaign ${input.campaignId} grouped by step.`,
    );

    return activities;
  }
}
