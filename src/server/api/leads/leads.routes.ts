import { createTRPCRouter, protectedProcedure } from '@server/api/trpc';

import { getLeadsSchema, createLeadsSchema, batchCreateLeads } from './data/dtos';
import { batchCreateLeadsHandler, createLeadHandler, getLeadsHandler } from './controllers';

export const leadsRoutes = createTRPCRouter({
  getLeads: protectedProcedure.input(getLeadsSchema).query(getLeadsHandler),
  createLead: protectedProcedure.input(createLeadsSchema).mutation(createLeadHandler),
  batchCreateLeads: protectedProcedure.input(batchCreateLeads).mutation(batchCreateLeadsHandler),
});
