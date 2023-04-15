import dayjs from 'dayjs';
import groupBy from 'lodash/groupBy';
import { ActivityStatus } from '@prisma/client';

import { prisma } from '@server/db';
import { logger } from '@utils/logger';

import type {
  CreateActivityInput,
  GetActivitiesInput,
  ActivityGroupedByDateStatus,
  ActivityStats,
} from '@server/api/activity/data/dtos';
import type { Activity, Prisma } from '@prisma/client';

export const createActivitiesRepository = async (payload: CreateActivityInput[]): Promise<Prisma.BatchPayload> => {
  return prisma.activity.createMany({ data: payload });
};

export const getActivitiesRepository = async (payload: GetActivitiesInput): Promise<Activity[]> => {
  return prisma.activity.findMany({
    where: {
      campaignId: payload.campaignId,
      leadEmail: payload?.leadEmail,
      status: { not: ActivityStatus.QUEUED },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export class ActivityRepository {
  static async getActivitiesStats(payload: GetActivitiesInput): Promise<ActivityStats[]> {
    const groupByDateStatus = await prisma.$queryRaw<ActivityGroupedByDateStatus[]>`
SELECT DATE_FORMAT(created_at, '%Y-%m-%d') as date, status, COUNT(*) as count , COUNT(DISTINCT CASE WHEN status = 'OPENED' THEN message_id ELSE NULL END) as unique_opened
FROM activities AS a 
WHERE campaign_id = ${payload.campaignId} 
  AND created_at BETWEEN DATE_FORMAT(NOW() - INTERVAL 7 DAY, '%Y-%m-%d %H:%i:%s') AND DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')
GROUP BY 1, 2;`;

    const result = groupByDateStatus.reduce((acc: any, item) => {
      const dateString = dayjs(item.date).format('YYYY-MM-DD');
      if (!acc[dateString]) {
        acc[dateString] = { date: item.date };
      }
      acc[dateString][item.status] = item.count.toString();
      if (item.status === 'OPENED') {
        acc[dateString]['UNIQUE_OPENED'] = item.unique_opened?.toString();
      }
      return acc;
    }, {});

    logger.info({ groupByDateStatus }, `Successfully returning activities grouped by status`);

    return Object.values(result);
  }
  static async getActivitiesByStep(payload: GetActivitiesInput): Promise<any> {
    const activities = await prisma.activity.groupBy({
      by: ['step', 'status'],
      where: {
        campaignId: payload.campaignId,
        createdAt: {
          lte: dayjs().toISOString(),
          gte: dayjs().subtract(7, 'd').toISOString(),
        },
      },
      _count: true,
    });
    const groupedByStep = Object.values(groupBy(activities, 'step'));
    const activitiesStats = groupedByStep.map(step =>
      Object.fromEntries(step.map(item => [item.status, { count: item._count, step: item.step }])),
    );
    return activitiesStats;
  }
}
