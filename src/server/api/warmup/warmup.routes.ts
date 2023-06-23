import { createTRPCRouter, protectedProcedure } from '@server/api/trpc';

import { warmupAccount } from './warmup.dto';
import { WarmupController } from './warmup.controller';

export const warmupRoutes = createTRPCRouter({
  enableWarmup: protectedProcedure.input(warmupAccount).mutation(WarmupController.enableWarmupHandler),
});
