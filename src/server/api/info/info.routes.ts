import { createTRPCRouter, protectedProcedure } from '@server/api/trpc';
import { InfoController } from '@server/api/info/info.controller';

export const infoRoutes = createTRPCRouter({
  init: protectedProcedure.query(InfoController.getInitHandler),
});
