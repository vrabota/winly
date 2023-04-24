import { Container } from 'typedi';

import { createTRPCRouter, protectedProcedure } from '@server/api/trpc';
import { InfoController } from '@server/api/info/info.controller';

const infoController = Container.get(InfoController);

export const infoRoutes = createTRPCRouter({
  init: protectedProcedure.query(infoController.getInitHandler),
});
