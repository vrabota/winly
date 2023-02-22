import { createTRPCRouter, protectedProcedure } from '@server/api/trpc';

import { createSequenceHandler } from './controllers';
import { createSequenceSchema } from './data/dtos';

export const sequencesRoutes = createTRPCRouter({
  createSequence: protectedProcedure.input(createSequenceSchema).mutation(createSequenceHandler),
});
