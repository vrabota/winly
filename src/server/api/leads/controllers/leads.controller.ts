import { TRPCError } from '@trpc/server';

import {
  getLeads,
  createLead,
  batchCreateLeads,
  getLeadById,
  updateLeadRepository,
  deleteLeadRepository,
  deleteBatchLeadsRepository,
} from '../data/repositories';

import type {
  GetLeadsInput,
  CreateLeadsInput,
  GetLeadIdInput,
  UpdateLeadInput,
  BatchDeleteLeadInput,
} from '../data/dtos';
import type { Context } from '@server/api/trpc';

export const getLeadsHandler = async ({ input }: { input: GetLeadsInput }) => {
  try {
    return getLeads({
      campaignId: input.campaignId,
    });
  } catch (error) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `Unfortunately can not receive any leads for campaign ${input.campaignId}.`,
      cause: error,
    });
  }
};

export const createLeadHandler = async ({ input }: { input: CreateLeadsInput }) => {
  try {
    return createLead(input);
  } catch (error) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `Unfortunately can not create ${input.email} lead for the campaign ${input.campaignId}.`,
      cause: error,
    });
  }
};

export const batchCreateLeadsHandler = async ({ input }: { ctx: Context; input: CreateLeadsInput[] }) => {
  try {
    return batchCreateLeads(input);
  } catch (error) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `Unfortunately can not batch create leads for the campaign.`,
      cause: error,
    });
  }
};

export const getLeadByIdHandler = async ({ input }: { ctx: Context; input: GetLeadIdInput }) => {
  const lead = await getLeadById(input);
  if (!lead) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `Unfortunately can not find lead with id ${input.leadId}.`,
    });
  }
  return lead;
};

export const updateLeadHandler = async ({ input }: { ctx: Context; input: UpdateLeadInput }) => {
  return updateLeadRepository(input);
};

export const deleteLeadHandler = async ({ input }: { ctx: Context; input: GetLeadIdInput }) => {
  return deleteLeadRepository(input);
};

export const deleteBatchLeadsHandler = async ({ input }: { ctx: Context; input: BatchDeleteLeadInput }) => {
  return deleteBatchLeadsRepository(input);
};
