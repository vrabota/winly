import { WarmupStatus } from '@prisma/client';

import { prisma } from '@server/db';

import { CampaignsService } from '../campaigns/campaigns.service';

import type { WarmupInput } from './warmup.dto';
import type { withOrgId } from '@server/types/withUserOrgIds';

export class WarmupRepository {
  static async disableWarmup(payload: withOrgId<WarmupInput>) {
    return prisma.$transaction(async prisma => {
      await prisma.account.update({ where: { id: payload.accountId }, data: { warmupState: false } });

      const queueIds = await prisma.warmup.findMany({
        where: {
          senderAccountId: payload.accountId,
          organizationId: payload.organizationId,
          status: { equals: WarmupStatus.QUEUED },
        },
        select: { queueId: true },
      });

      for (const item of queueIds) {
        if (typeof item.queueId === 'string') {
          // Delete messages from queue
          await CampaignsService.stopCampaign(item.queueId);
        }
      }

      await prisma.warmup.deleteMany({
        where: {
          senderAccountId: payload.accountId,
          organizationId: payload.organizationId,
          status: { equals: WarmupStatus.QUEUED },
        },
      });

      return { message: `Warmup successfully disabled.` };
    });
  }
}
