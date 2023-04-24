import { CampaignStatus } from '@prisma/client';
import omit from 'lodash/omit';
import { Service } from 'typedi';

import { prisma } from '@server/db';

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

@Service()
export class CampaignsRepository {
  async createCampaign(payload: withUserOrgIds<CreateCampaignInput>): Promise<Campaign> {
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

  async getCampaigns(payload: withUserOrgIds<GetAllCampaignsInput>): Promise<CampaignWithStats[]> {
    return prisma.$transaction(async prisma => {
      const activitiesByCampaign = await prisma.activity.groupBy({
        by: ['status', 'campaignId'],
        _count: true,
      });

      const allCampaigns = await prisma.campaign.findMany({
        where: {
          organizationId: payload.organizationId,
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

  async getCampaignById(payload: withUserOrgIds<GetCampaignByIdInput>): Promise<Campaign | null> {
    return prisma.campaign.findFirst({
      where: {
        id: payload.campaignId,
        organizationId: payload.organizationId,
      },
    });
  }

  async updateCampaign(payload: withUserId<UpdateCampaignInput>): Promise<Campaign> {
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

  async updateCampaignSequences(payload: withUserId<UpdateCampaignSequenceInput>): Promise<Campaign> {
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

  async renameCampaign(payload: RenameCampaignInput): Promise<Campaign> {
    return prisma.campaign.update({
      where: { id: payload.campaignId },
      data: { name: payload.name },
    });
  }

  async deleteCampaign(payload: GetCampaignByIdInput): Promise<Campaign> {
    return prisma.campaign.delete({
      where: { id: payload.campaignId },
    });
  }
}
