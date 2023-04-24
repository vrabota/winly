import { TRPCError } from '@trpc/server';
import { Container, Service } from 'typedi';

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

@Service()
export class LeadsController {
  async getLeadsHandler({ input }: { input: GetLeadsInput }) {
    logger.info({ input }, `Getting leads for campaign ${input.campaignId}`);

    const leadsRepository = Container.get(LeadsRepository);
    const leads = await leadsRepository.getLeads(input);

    logger.info({ leads }, `Successfully received leads for campaign ${input.campaignId}`);

    return leads;
  }

  async createLeadHandler({ input, ctx }: { input: CreateLeadsInput; ctx: Context }) {
    logger.info({ input }, `Creating ${input.email} lead for campaign ${input.campaignId}`);

    const leadsRepository = Container.get(LeadsRepository);
    const createdLead = await leadsRepository.createLead(input, ctx.organizationId);

    logger.info(
      { createdLead },
      `Successfully created ${createdLead.email} lead for campaign ${createdLead.campaignId}`,
    );

    return createdLead;
  }

  async batchCreateLeadsHandler({ input, ctx }: { ctx: Context; input: CreateLeadsInput[] }) {
    logger.info({ input }, `Batch creating leads for campaign ${input?.[0]?.campaignId}`);

    const leadsRepository = Container.get(LeadsRepository);
    const leadsCreatedCount = await leadsRepository.batchCreateLeads(input, ctx.organizationId);

    logger.info({ leadsCreatedCount }, `Successfully batch created leads for campaign ${input?.[0]?.campaignId}`);

    return leadsCreatedCount;
  }

  async getLeadByIdHandler({ input }: { ctx: Context; input: GetLeadIdInput }) {
    logger.info({ input }, `Getting ${input.leadId} lead data.`);

    const leadsRepository = Container.get(LeadsRepository);
    const lead = await leadsRepository.getLeadById(input);

    if (!lead) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Unfortunately can not find lead with id ${input.leadId}.`,
      });
    }

    logger.info({ lead }, `Successfully received lead data.`);

    return lead;
  }

  async updateLeadHandler({ input }: { ctx: Context; input: UpdateLeadInput }) {
    logger.info({ input }, `Updating ${input.leadId} lead data.`);

    const leadsRepository = Container.get(LeadsRepository);
    const lead = await leadsRepository.updateLeadRepository(input);

    logger.info({ lead }, `Successfully updated lead ${lead.id} data.`);

    return lead;
  }

  async deleteLeadHandler({ input }: { ctx: Context; input: GetLeadIdInput }) {
    logger.info({ input }, `Deleting ${input.leadId} lead.`);

    const leadsRepository = Container.get(LeadsRepository);
    const lead = await leadsRepository.deleteLeadRepository(input);

    logger.info({ lead }, `Successfully deleted lead ${lead.id}.`);

    return lead;
  }

  async deleteBatchLeadsHandler({ input }: { ctx: Context; input: BatchDeleteLeadInput }) {
    logger.info(input, `Deleting leads.`);

    const leadsRepository = Container.get(LeadsRepository);
    const deletedLeadsCount = await leadsRepository.deleteBatchLeadsRepository(input);

    logger.info(input, `Successfully deleted leads.`);

    return deletedLeadsCount;
  }
}
