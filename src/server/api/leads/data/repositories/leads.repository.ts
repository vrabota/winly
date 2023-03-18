import { prisma } from '@server/db';
import { logger } from '@utils/logger';

import type { Prisma, Lead } from '@prisma/client';
import type { CreateLeadsInput, GetLeadsInput } from '@server/api/leads/data/dtos';

export const createLead = async (payload: CreateLeadsInput): Promise<Lead> => {
  logger.info({ payload }, `Creating ${payload.email} lead for campaign ${payload.campaignId}`);

  const lead = await prisma.lead.create({
    data: payload,
  });

  logger.info({ lead }, `Successfully created ${payload.email} lead for campaign ${payload.campaignId}`);

  return lead;
};

export const batchCreateLeads = async (payload: CreateLeadsInput[]): Promise<Prisma.BatchPayload> => {
  logger.info({ payload }, `Batch creating leads for campaign ${payload?.[0]?.campaignId}`);

  const lead = await prisma.lead.createMany({
    data: payload,
  });

  logger.info({ lead }, `Successfully batch created leads for campaign ${payload?.[0]?.campaignId}`);

  return lead;
};

export const getLeads = async (payload: GetLeadsInput): Promise<Lead[]> => {
  logger.info({ payload }, `Getting leads for campaign ${payload.campaignId}`);

  const leads = await prisma.lead.findMany({
    where: {
      campaignId: payload.campaignId,
    },
  });

  logger.info({ leads }, `Successfully received leads for campaign ${payload.campaignId}`);

  return leads;
};
