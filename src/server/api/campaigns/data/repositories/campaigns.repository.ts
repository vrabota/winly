import { CampaignStatus } from '@prisma/client';
import omit from 'lodash/omit';

import { prisma } from '@server/db';
import { logger } from '@utils/logger';

import type { withUserId, withUserOrgIds } from '@server/types/withUserOrgIds';
import type {
  CreateCampaignInput,
  GetCampaignByIdInput,
  UpdateCampaignInput,
  UpdateCampaignSequenceInput,
} from '@server/api/campaigns/data/dtos';
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

export const getCampaigns = async (payload: withUserOrgIds<{}>): Promise<Campaign[]> => {
  logger.info(
    { payload },
    `Getting all campaigns for user ${payload.userId} and organization ${payload.organizationId}`,
  );

  const campaigns = await prisma.campaign.findMany({
    where: {
      organizationId: payload.organizationId,
    },
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
