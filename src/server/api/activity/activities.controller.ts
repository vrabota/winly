import { logger } from '@utils/logger';

import { ActivityRepository } from './activity.repository';

import type { GetActivitiesInput } from './activity.dto';

export class ActivityController {
  static async getActivitiesHandler({ input }: { input: GetActivitiesInput }) {
    logger.info({ input }, `Getting list of activities for campaign ${input.campaignId}.`);

    const activities = await ActivityRepository.getAll(input);

    logger.info({ activities }, `Successfully returned list of activities for campaign ${input.campaignId}.`);

    return activities;
  }
  static async getActivitiesStatsHandler({ input }: { input: GetActivitiesInput }) {
    logger.info({ input }, `Getting list of activities grouped by date and status.`);

    const activities = await ActivityRepository.getActivitiesByDateAndStatus(input);

    logger.info({ activities }, `Successfully returned list of activities grouped by date and status.`);

    return activities;
  }
  static async getActivitiesByStepHandler({ input }: { input: GetActivitiesInput }) {
    logger.info({ input }, `Getting list of activities for campaign ${input.campaignId} grouped by step.`);

    const activities = await ActivityRepository.getActivitiesByStep(input);

    logger.info(
      { activities },
      `Successfully returned list of activities for campaign ${input.campaignId} grouped by step.`,
    );

    return activities;
  }
}
