import omit from 'lodash/omit';

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

export class LeadsRepository {
  static async createLead(payload: CreateLeadsInput, organizationId: string): Promise<Lead> {
    return prisma.lead.create({
      data: { ...payload, organizationId },
    });
  }

  static async batchCreateLeads(payload: CreateLeadsInput[], organizationId: string): Promise<Prisma.BatchPayload> {
    return prisma.lead.createMany({
      data: payload.map(lead => ({ ...lead, organizationId })),
    });
  }

  static async getLeads(payload: withOrgId<GetLeadsInput>): Promise<{ items: Lead[]; nextCursor: string | undefined }> {
    const items = await prisma.lead.findMany({
      where: {
        campaignId: payload.campaignId,
        organizationId: payload.organizationId,
        status: { in: payload.leadStatus },
        AND: [
          {
            OR: payload.search
              ? [
                  { firstName: { contains: payload.search } },
                  { lastName: { contains: payload.search } },
                  { email: { contains: payload.search } },
                  { companyName: { contains: payload.search } },
                ]
              : undefined,
          },
        ],
      },
      take: payload.limit ? payload.limit + 1 : undefined,
      cursor: payload.cursor ? { id: payload.cursor } : undefined,
    });
    let nextCursor: typeof payload.cursor | undefined = undefined;
    if (payload?.limit && items.length > payload?.limit) {
      const nextItem = items.pop(); // return the last item from the array
      nextCursor = nextItem?.id;
    }
    return {
      items,
      nextCursor,
    };
  }

  static async getLeadById(payload: GetLeadIdInput): Promise<Lead | null> {
    return prisma.lead.findUnique({
      where: {
        id: payload.leadId,
      },
    });
  }

  static async updateLeadRepository(payload: UpdateLeadInput): Promise<Lead> {
    return prisma.lead.update({
      where: {
        id: payload.leadId,
      },
      data: omit(payload, ['leadId']),
    });
  }

  static async deleteLeadRepository(payload: GetLeadIdInput): Promise<Lead> {
    return prisma.lead.delete({
      where: {
        id: payload.leadId,
      },
    });
  }

  static async deleteBatchLeadsRepository(payload: BatchDeleteLeadInput): Promise<Prisma.BatchPayload> {
    return prisma.lead.deleteMany({
      where: {
        id: {
          in: payload.leadIds,
        },
      },
    });
  }
}
