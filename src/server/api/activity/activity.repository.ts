import dayjs from 'dayjs';
import groupBy from 'lodash/groupBy';
import { ActivityStatus, LeadStatus, Prisma } from '@prisma/client';

import { prisma } from '@server/db';
import { getPeriodDates } from '@utils/period';

import type {
  CreateActivityInput,
  GetActivitiesInput,
  ActivityGroupedByDateStatus,
  ActivityStats,
  GetRepliedActivitiesInput,
} from './activity.dto';
import type { Activity } from '@prisma/client';

export class ActivityRepository {
  static async createActivitiesRepository(payload: CreateActivityInput[]): Promise<Prisma.BatchPayload> {
    return prisma.activity.createMany({ data: payload });
  }

  static async getAll(payload: GetActivitiesInput): Promise<{ items: Activity[]; nextCursor: string | undefined }> {
    const items = await prisma.activity.findMany({
      where: {
        organizationId: payload.organizationId,
        campaignId: payload.campaignId,
        leadEmail: payload?.leadEmail,
        status: { not: ActivityStatus.QUEUED },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: payload.limit ? payload.limit + 1 : undefined,
      cursor: payload.cursor ? { id: payload.cursor } : undefined,
    });
    let nextCursor: typeof payload.cursor | undefined = undefined;
    if (payload?.limit && items.length > payload?.limit) {
      const nextItem = items.pop();
      nextCursor = nextItem?.id;
    }
    return { items, nextCursor };
  }

  static async getActivitiesByDateAndStatus(payload: GetActivitiesInput): Promise<ActivityStats[]> {
    const groupByDateStatus = await prisma.$queryRaw<ActivityGroupedByDateStatus[]>`
SELECT DATE_FORMAT(created_at, '%Y-%m-%d') as date, status, COUNT(*) as count , COUNT(DISTINCT CASE WHEN status = 'OPENED' THEN message_id ELSE NULL END) as unique_opened
FROM activities AS a 
WHERE 
${payload.campaignId ? Prisma.sql`campaign_id = ${payload.campaignId} AND` : Prisma.empty}
${payload.organizationId ? Prisma.sql`organization_id = ${payload.organizationId} AND` : Prisma.empty}
${
  payload.period
    ? Prisma.sql`created_at BETWEEN ${getPeriodDates(payload.period, payload.customPeriod)[0]} AND ${
        getPeriodDates(payload.period, payload.customPeriod)[1]
      }`
    : Prisma.empty
}
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
          lte: getPeriodDates(payload.period, payload.customPeriod)[1],
          gte: getPeriodDates(payload.period, payload.customPeriod)[0],
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

  static async getRepliedActivities(payload: GetRepliedActivitiesInput): Promise<{ items: Activity[] }> {
    const items = await prisma.activity.findMany({
      where: {
        organizationId: payload.organizationId,
        accountId: payload.accountIds && payload.accountIds?.length > 0 ? { in: payload.accountIds } : undefined,
        leadEmail: { contains: payload?.leadEmail },
        status: ActivityStatus.REPLIED,
        campaignId: payload.campaignIds && payload.campaignIds?.length > 0 ? { in: payload.campaignIds } : undefined,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    // const leads = await prisma.lead.findMany({
    //   where: {
    //     status: LeadStatus.INTERESTED,
    //   },
    // });
    return { items };
  }
}
