import { CampaignStatus } from '@prisma/client';
import omit from 'lodash/omit';

import { prisma } from '@server/db';
import { logger } from '@utils/logger';

import type {
  CampaignWithStats,
  CreateCampaignInput,
  GetAllCampaignsInput,
  GetCampaignByIdInput,
  RenameCampaignInput,
  UpdateCampaignInput,
  UpdateCampaignSequenceInput,
} from '@server/api/campaigns/data/dtos';
import type { withUserId, withUserOrgIds } from '@server/types/withUserOrgIds';
import type { Campaign } from '@prisma/client';

export const createCampaign = async (payload: withUserOrgIds<CreateCampaignInput>): Promise<Campaign> => {
  logger.info({ payload }, `Creating campaign ${payload.name}`);

  const campaign = await prisma.campaign.create({
    data: {
      organizationId: payload.organizationId,
      name: payload.name,
      status: CampaignStatus.DRAFT,
      addedById: payload.userId,
      modifiedById: payload.userId,
    },
  });

  logger.info({ campaign }, `Successfully created campaign ${payload.name}`);

  return campaign;
};

export const getCampaigns = async (payload: withUserOrgIds<GetAllCampaignsInput>): Promise<CampaignWithStats[]> => {
  logger.info(
    { payload },
    `Getting all campaigns for user ${payload.userId} and organization ${payload.organizationId}`,
  );

  const campaigns = await prisma.$transaction(async prisma => {
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

  logger.info({ campaigns }, `Successfully returned list of all campaigns for organization ${payload.organizationId}`);

  return campaigns;
};

export const getCampaignById = async (payload: withUserOrgIds<GetCampaignByIdInput>): Promise<Campaign | null> => {
  logger.info({ payload }, `Getting campaign with id ${payload.campaignId}`);

  const campaign = await prisma.campaign.findUnique({
    where: {
      id: payload.campaignId,
    },
  });

  logger.info({ campaign }, `Successfully returned campaign with id ${payload.campaignId}`);

  return campaign;
};

export const updateCampaign = async (payload: withUserId<UpdateCampaignInput>): Promise<Campaign> => {
  logger.info({ payload }, `Updating campaign ${payload.campaignId}`);

  const campaign = await prisma.campaign.update({
    where: {
      id: payload.campaignId,
    },
    data: {
      ...omit(payload, ['campaignId', 'userId']),
      modifiedById: payload.userId,
    },
  });

  logger.info({ campaign }, `Successfully updated campaign ${payload.campaignId}`);

  return campaign;
};

export const updateCampaignSequences = async (payload: withUserId<UpdateCampaignSequenceInput>): Promise<Campaign> => {
  logger.info({ payload }, `Updating campaign sequences ${payload.sequences}`);

  const campaign = await prisma.campaign.update({
    where: {
      id: payload.campaignId,
    },
    data: {
      sequences: payload.sequences,
      modifiedById: payload.userId,
    },
  });

  logger.info({ campaign }, `Successfully updated campaign sequences ${payload.campaignId}`);

  return campaign;
};

export const renameCampaign = async (payload: RenameCampaignInput): Promise<Campaign> => {
  logger.info({ payload }, `Updating campaign name ${payload.name}`);

  const campaign = await prisma.campaign.update({
    where: { id: payload.campaignId },
    data: { name: payload.name },
  });

  logger.info({ campaign }, `Successfully updated campaign name ${payload.name}`);

  return campaign;
};

export const deleteCampaign = async (payload: GetCampaignByIdInput): Promise<Campaign> => {
  logger.info({ payload }, `Deleting campaign ${payload.campaignId}`);

  const campaign = await prisma.campaign.delete({
    where: { id: payload.campaignId },
  });

  logger.info({ campaign }, `Successfully deleted campaign ${payload.campaignId}`);

  return campaign;
};
