import dayjs from 'dayjs';
import groupBy from 'lodash/groupBy';
import { ActivityStatus, Prisma } from '@prisma/client';

import { prisma } from '@server/db';

import type {
  CreateActivityInput,
  GetActivitiesInput,
  ActivityGroupedByDateStatus,
  ActivityStats,
} from './activity.dto';
import type { Activity } from '@prisma/client';

export class ActivityRepository {
  static async createActivitiesRepository(payload: CreateActivityInput[]): Promise<Prisma.BatchPayload> {
    return prisma.activity.createMany({ data: payload });
  }

  static async getAll(payload: GetActivitiesInput): Promise<Activity[]> {
    return prisma.activity.findMany({
      where: {
        organizationId: payload.organizationId,
        campaignId: payload.campaignId,
        leadEmail: payload?.leadEmail,
        status: { not: ActivityStatus.QUEUED },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  static async getActivitiesByDateAndStatus(payload: GetActivitiesInput): Promise<ActivityStats[]> {
    const groupByDateStatus = await prisma.$queryRaw<ActivityGroupedByDateStatus[]>`
SELECT DATE_FORMAT(created_at, '%Y-%m-%d') as date, status, COUNT(*) as count , COUNT(DISTINCT CASE WHEN status = 'OPENED' THEN message_id ELSE NULL END) as unique_opened
FROM activities AS a 
WHERE ${payload.campaignId ? Prisma.sql`campaign_id = ${payload.campaignId} AND` : Prisma.empty} ${
      payload.organizationId ? Prisma.sql`organization_id = ${payload.organizationId} AND` : Prisma.empty
    } created_at BETWEEN DATE_FORMAT(NOW() - INTERVAL 7 DAY, '%Y-%m-%d %H:%i:%s') AND DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')
GROUP BY 1, 2;`;

    const result = groupByDateStatus.reduce((acc: any, item: any) => {
      const dateString = dayjs(item.date).format('YYYY-MM-DD');
      if (!acc[dateString]) {
        acc[dateString] = { date: item.date };
      }
      acc[dateString][item.status] = typeof item.count === 'bigint' ? parseInt(item.count) : item.count;
      if (item.status === 'OPENED') {
        acc[dateString]['UNIQUE_OPENED'] =
          typeof item.unique_opened === 'bigint' ? parseInt(item.unique_opened) : item.unique_opened;
      }
      return acc;
    }, {});

    return Object.values(result);
  }

  static async getActivitiesByStep(payload: GetActivitiesInput): Promise<any> {
    const activities = await prisma.activity.groupBy({
      by: ['step', 'status'],
      where: {
        campaignId: payload.campaignId,
        organizationId: payload.organizationId,
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
