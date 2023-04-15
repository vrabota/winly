import omit from 'lodash/omit';

import { prisma } from '@server/db';
import { logger } from '@utils/logger';

import type {
  BatchDeleteLeadInput,
  CreateLeadsInput,
  GetLeadIdInput,
  GetLeadsInput,
  UpdateLeadInput,
} from '@server/api/leads/data/dtos';
import type { Prisma, Lead } from '@prisma/client';

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

export const getLeadById = async (payload: GetLeadIdInput): Promise<Lead | null> => {
  logger.info({ payload }, `Getting ${payload.leadId} lead data.`);

  const lead = await prisma.lead.findUnique({
    where: {
      id: payload.leadId,
    },
  });

  logger.info({ lead }, `Successfully received lead data.`);

  return lead;
};

export const updateLeadRepository = async (payload: UpdateLeadInput): Promise<Lead> => {
  logger.info({ payload }, `Updating ${payload.leadId} lead data.`);

  const lead = await prisma.lead.update({
    where: {
      id: payload.leadId,
    },
    data: omit(payload, ['leadId']),
  });

  logger.info({ lead }, `Successfully updated lead ${lead.id} data.`);

  return lead;
};

export const deleteLeadRepository = async (payload: GetLeadIdInput): Promise<Lead> => {
  logger.info({ payload }, `Deleting ${payload.leadId} lead.`);

  const lead = await prisma.lead.delete({
    where: {
      id: payload.leadId,
    },
  });

  logger.info({ lead }, `Successfully deleted lead ${lead.id}.`);

  return lead;
};

export const deleteBatchLeadsRepository = async (payload: BatchDeleteLeadInput): Promise<Prisma.BatchPayload> => {
  logger.info({ leadIds: payload.leadIds }, `Deleting leads.`);

  const lead = await prisma.lead.deleteMany({
    where: {
      id: {
        in: payload.leadIds,
      },
    },
  });

  logger.info({ leadIds: payload.leadIds }, `Successfully deleted leads.`);

  return lead;
};
