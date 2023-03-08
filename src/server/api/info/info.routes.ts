import { createTRPCRouter, protectedProcedure } from '@server/api/trpc';
import { getInitHandler } from '@server/api/info/controllers';

export const infoRoutes = createTRPCRouter({
  init: protectedProcedure.query(getInitHandler),
});
