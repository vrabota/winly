import { ActivityStatus, CampaignStatus } from '@prisma/client';
import omit from 'lodash/omit';

import { prisma } from '@server/db';
import { CampaignsService } from '@server/api/campaigns/campaigns.service';
import { getPeriodDates } from '@utils/period';
import { DateRanges } from '@features/campaigns/utils';

import type {
  CampaignWithStats,
  CreateCampaignInput,
  GetAllCampaignsInput,
  GetCampaignByIdInput,
  RenameCampaignInput,
  UpdateCampaignInput,
  UpdateCampaignSequenceInput,
} from './campaigns.dto';
import type { withUserId, withUserOrgIds } from '@server/types/withUserOrgIds';
import type { Campaign } from '@prisma/client';

export class CampaignsRepository {
  static async createCampaign(payload: withUserOrgIds<CreateCampaignInput>): Promise<Campaign> {
    return prisma.campaign.create({
      data: {
        organizationId: payload.organizationId,
        name: payload.name,
        status: CampaignStatus.DRAFT,
        addedById: payload.userId,
        modifiedById: payload.userId,
      },
    });
  }

  static async getCampaigns(payload: withUserOrgIds<GetAllCampaignsInput>): Promise<CampaignWithStats[]> {
    return prisma.$transaction(async prisma => {
      const activitiesByCampaign = await prisma.activity.groupBy({
        by: ['status', 'campaignId'],
        _count: true,
        where: {
          organizationId: payload.organizationId,
          createdAt: {
            lte: getPeriodDates(DateRanges.Week)[1],
            gte: getPeriodDates(DateRanges.Week)[0],
          },
        },
      });

      const allCampaigns = await prisma.campaign.findMany({
        where: {
          organizationId: payload.organizationId,
          status: { in: payload.campaignStatus },
          AND: [
            {
              OR: payload.search ? [{ name: { contains: payload.search } }] : undefined,
            },
          ],
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      const campaignsWithStats = allCampaigns.map(campaign => ({
        ...campaign,
        stats: Object.fromEntries(
          activitiesByCampaign
            .filter(item => item.campaignId === campaign.id)
            .map(activity => [activity.status, { ...activity }]),
        ),
      }));

      return payload.withStats ? campaignsWithStats : allCampaigns;
    });
  }

  static async getCampaignById(payload: withUserOrgIds<GetCampaignByIdInput>): Promise<Campaign | null> {
    return prisma.campaign.findFirst({
      where: {
        id: payload.campaignId,
        organizationId: payload.organizationId,
      },
    });
  }

  static async updateCampaign(payload: withUserId<UpdateCampaignInput>): Promise<Campaign> {
    return prisma.campaign.update({
      where: {
        id: payload.campaignId,
      },
      data: {
        ...omit(payload, ['campaignId', 'userId']),
        modifiedById: payload.userId,
      },
    });
  }

  static async updateCampaignSequences(payload: withUserId<UpdateCampaignSequenceInput>): Promise<Campaign> {
    return prisma.campaign.update({
      where: {
        id: payload.campaignId,
      },
      data: {
        sequences: payload.sequences,
        modifiedById: payload.userId,
      },
    });
  }

  static async renameCampaign(payload: RenameCampaignInput): Promise<Campaign> {
    return prisma.campaign.update({
      where: { id: payload.campaignId },
      data: { name: payload.name },
    });
  }

  static async deleteCampaign(payload: GetCampaignByIdInput): Promise<Campaign> {
    return prisma.campaign.delete({
      where: { id: payload.campaignId },
    });
  }

  static async stopCampaign(payload: GetCampaignByIdInput) {
    return prisma.$transaction(async prisma => {
      await prisma.campaign.update({ where: { id: payload.campaignId }, data: { status: CampaignStatus.PAUSE } });

      const queueIds = await prisma.activity.findMany({
        where: {
          campaignId: payload.campaignId,
          organizationId: payload.organizationId,
          status: { equals: ActivityStatus.QUEUED },
        },
        select: { queueId: true },
      });

      for (const item of queueIds) {
        if (typeof item.queueId === 'string') {
          await CampaignsService.stopCampaign(item.queueId);
        }
      }

      await prisma.activity.deleteMany({
        where: {
          campaignId: payload.campaignId,
          organizationId: payload.organizationId,
          status: { equals: ActivityStatus.QUEUED },
        },
      });

      return { message: `Campaign ${payload.campaignId} successfully stopped.` };
    });
  }
}
