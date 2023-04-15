import { createTRPCRouter, protectedProcedure } from '@server/api/trpc';

import {
  getLeadsSchema,
  createLeadsSchema,
  batchCreateLeads,
  getLeadIdSchema,
  updateLeadSchema,
  batchDeleteLeadsSchema,
} from './data/dtos';
import {
  batchCreateLeadsHandler,
  createLeadHandler,
  deleteBatchLeadsHandler,
  deleteLeadHandler,
  getLeadByIdHandler,
  getLeadsHandler,
  updateLeadHandler,
} from './controllers';

export const leadsRoutes = createTRPCRouter({
  getLeads: protectedProcedure.input(getLeadsSchema).query(getLeadsHandler),
  getLead: protectedProcedure.input(getLeadIdSchema).query(getLeadByIdHandler),
  updateLead: protectedProcedure.input(updateLeadSchema).mutation(updateLeadHandler),
  deleteLead: protectedProcedure.input(getLeadIdSchema).mutation(deleteLeadHandler),
  createLead: protectedProcedure.input(createLeadsSchema).mutation(createLeadHandler),
  batchCreateLeads: protectedProcedure.input(batchCreateLeads).mutation(batchCreateLeadsHandler),
  batchDeleteLeads: protectedProcedure.input(batchDeleteLeadsSchema).mutation(deleteBatchLeadsHandler),
});
