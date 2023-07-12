import { logger } from '@utils/logger';
import enableWarmup from 'defer/enableWarmup';

import { WarmupRepository } from './warmup.repository';

import type { Context } from '@server/api/trpc';
import type { WarmupInput } from './warmup.dto';

export class WarmupController {
  static async enableWarmupHandler({ input, ctx }: { input: WarmupInput; ctx: Context }) {
    logger.info(`Enabling warmup service for account ${input.accountId}`);

    const account = await ctx.prisma.account.update({ where: { id: input.accountId }, data: { warmupState: true } });

    await enableWarmup([account], ctx.organizationId);

    logger.info(`Successfully enabled warmup service for account ${input.accountId}`);

    return { message: 'Warmup enabled' };
  }

  static async disableWarmupHandler({ input, ctx }: { input: WarmupInput; ctx: Context }) {
    logger.info(`Disabling warmup service for account ${input.accountId}`);

    await WarmupRepository.disableWarmup({ accountId: input.accountId, organizationId: ctx.organizationId });

    logger.info(`Successfully disabled warmup service for account ${input.accountId}`);

    return { message: 'Warmup disabled' };
  }
}
