import omit from 'lodash/omit';
import { Service } from 'typedi';

import { prisma } from '@server/db';

import type { withOrgId } from '@server/types/withUserOrgIds';
import type {
  BatchDeleteLeadInput,
  CreateLeadsInput,
  GetLeadIdInput,
  GetLeadsInput,
  UpdateLeadInput,
} from './leads.dto';
import type { Prisma, Lead } from '@prisma/client';

@Service()
export class LeadsRepository {
  async createLead(payload: CreateLeadsInput, organizationId: string): Promise<Lead> {
    return prisma.lead.create({
      data: { ...payload, organizationId },
    });
  }

  async batchCreateLeads(payload: CreateLeadsInput[], organizationId: string): Promise<Prisma.BatchPayload> {
    return prisma.lead.createMany({
      data: payload.map(lead => ({ ...lead, organizationId })),
    });
  }

  async getLeads(payload: withOrgId<GetLeadsInput>): Promise<Lead[]> {
    return prisma.lead.findMany({
      where: {
        campaignId: payload.campaignId,
        organizationId: payload.organizationId,
      },
    });
  }

  async getLeadById(payload: GetLeadIdInput): Promise<Lead | null> {
    return prisma.lead.findUnique({
      where: {
        id: payload.leadId,
      },
    });
  }

  async updateLeadRepository(payload: UpdateLeadInput): Promise<Lead> {
    return prisma.lead.update({
      where: {
        id: payload.leadId,
      },
      data: omit(payload, ['leadId']),
    });
  }

  async deleteLeadRepository(payload: GetLeadIdInput): Promise<Lead> {
    return prisma.lead.delete({
      where: {
        id: payload.leadId,
      },
    });
  }

  async deleteBatchLeadsRepository(payload: BatchDeleteLeadInput): Promise<Prisma.BatchPayload> {
    return prisma.lead.deleteMany({
      where: {
        id: {
          in: payload.leadIds,
        },
      },
    });
  }
}
