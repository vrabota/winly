import { createTRPCRouter, protectedProcedure } from '@server/api/trpc';

import {
  getLeadsSchema,
  createLeadsSchema,
  batchCreateLeads,
  getLeadIdSchema,
  updateLeadSchema,
  batchDeleteLeadsSchema,
} from './leads.dto';
import { LeadsController } from './leads.controller';

export const leadsRoutes = createTRPCRouter({
  getLeads: protectedProcedure.input(getLeadsSchema).query(LeadsController.getLeadsHandler),
  getLead: protectedProcedure.input(getLeadIdSchema).query(LeadsController.getLeadByIdHandler),
  updateLead: protectedProcedure.input(updateLeadSchema).mutation(LeadsController.updateLeadHandler),
  deleteLead: protectedProcedure.input(getLeadIdSchema).mutation(LeadsController.deleteLeadHandler),
  createLead: protectedProcedure.input(createLeadsSchema).mutation(LeadsController.createLeadHandler),
  batchCreateLeads: protectedProcedure.input(batchCreateLeads).mutation(LeadsController.batchCreateLeadsHandler),
  batchDeleteLeads: protectedProcedure.input(batchDeleteLeadsSchema).mutation(LeadsController.deleteBatchLeadsHandler),
});
