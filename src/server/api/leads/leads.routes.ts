import { Container } from 'typedi';

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

const leadsController = Container.get(LeadsController);

export const leadsRoutes = createTRPCRouter({
  getLeads: protectedProcedure.input(getLeadsSchema).query(leadsController.getLeadsHandler),
  getLead: protectedProcedure.input(getLeadIdSchema).query(leadsController.getLeadByIdHandler),
  updateLead: protectedProcedure.input(updateLeadSchema).mutation(leadsController.updateLeadHandler),
  deleteLead: protectedProcedure.input(getLeadIdSchema).mutation(leadsController.deleteLeadHandler),
  createLead: protectedProcedure.input(createLeadsSchema).mutation(leadsController.createLeadHandler),
  batchCreateLeads: protectedProcedure.input(batchCreateLeads).mutation(leadsController.batchCreateLeadsHandler),
  batchDeleteLeads: protectedProcedure.input(batchDeleteLeadsSchema).mutation(leadsController.deleteBatchLeadsHandler),
});
