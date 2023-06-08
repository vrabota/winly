import { logger } from '@utils/logger';

import { ActivityRepository } from './activity.repository';
import { ActivitiesService } from './activities.service';

import type { GetActivitiesInput, GetRepliedActivitiesInput, GetRepliedThredInput } from './activity.dto';

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

  static async getRepliedActivities({ input }: { input: GetRepliedActivitiesInput }) {
    logger.info({ input }, `Getting list of replied activities.`);

    const activities = await ActivityRepository.getRepliedActivities(input);

    logger.info({ activities }, `Successfully returned list of replied activities.`);

    return activities;
  }

  static async getRepliedThread({ input }: { input: GetRepliedThredInput }) {
    logger.info({ input }, `Getting list of replied messages for thread ${input.threadId}.`);

    const messages = await ActivitiesService.getThreadMessages(input.accountId, input.threadId);

    logger.info({ messages }, `Successfully returned list of messages for thread ${input.threadId}.`);

    return messages;
  }
}
