import { TRPCError } from '@trpc/server';

import { logger } from '@utils/logger';

import { LeadsRepository } from './leads.repository';

import type {
  GetLeadsInput,
  CreateLeadsInput,
  GetLeadIdInput,
  UpdateLeadInput,
  BatchDeleteLeadInput,
} from './leads.dto';
import type { Context } from '@server/api/trpc';

export class LeadsController {
  static async getLeadsHandler({ input }: { input: GetLeadsInput }) {
    logger.info({ input }, `Getting leads for campaign ${input.campaignId}`);

    const leads = await LeadsRepository.getLeads(input);

    logger.info({ leads }, `Successfully received leads for campaign ${input.campaignId}`);

    return leads;
  }

  static async createLeadHandler({ input, ctx }: { input: CreateLeadsInput; ctx: Context }) {
    logger.info({ input }, `Creating ${input.email} lead for campaign ${input.campaignId}`);

    const createdLead = await LeadsRepository.createLead(input, ctx.organizationId);

    logger.info(
      { createdLead },
      `Successfully created ${createdLead.email} lead for campaign ${createdLead.campaignId}`,
    );

    return createdLead;
  }

  static async batchCreateLeadsHandler({ input, ctx }: { ctx: Context; input: CreateLeadsInput[] }) {
    logger.info({ input }, `Batch creating leads for campaign ${input?.[0]?.campaignId}`);

    const leadsCreatedCount = await LeadsRepository.batchCreateLeads(input, ctx.organizationId);

    logger.info({ leadsCreatedCount }, `Successfully batch created leads for campaign ${input?.[0]?.campaignId}`);

    return leadsCreatedCount;
  }

  static async getLeadByIdHandler({ input }: { ctx: Context; input: GetLeadIdInput }) {
    logger.info({ input }, `Getting ${input.leadId} lead data.`);

    const lead = await LeadsRepository.getLeadById(input);

    if (!lead) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Unfortunately can not find lead with id ${input.leadId}.`,
      });
    }

    logger.info({ lead }, `Successfully received lead data.`);

    return lead;
  }

  static async updateLeadHandler({ input }: { ctx: Context; input: UpdateLeadInput }) {
    logger.info({ input }, `Updating ${input.leadId} lead data.`);

    const lead = await LeadsRepository.updateLeadRepository(input);

    logger.info({ lead }, `Successfully updated lead ${lead.id} data.`);

    return lead;
  }

  static async deleteLeadHandler({ input }: { ctx: Context; input: GetLeadIdInput }) {
    logger.info({ input }, `Deleting ${input.leadId} lead.`);

    const lead = await LeadsRepository.deleteLeadRepository(input);

    logger.info({ lead }, `Successfully deleted lead ${lead.id}.`);

    return lead;
  }

  static async deleteBatchLeadsHandler({ input }: { ctx: Context; input: BatchDeleteLeadInput }) {
    logger.info(input, `Deleting leads.`);

    const deletedLeadsCount = await LeadsRepository.deleteBatchLeadsRepository(input);

    logger.info(input, `Successfully deleted leads.`);

    return deletedLeadsCount;
  }
}
