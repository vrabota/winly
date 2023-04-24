import { Container } from 'typedi';

import { createTRPCRouter, protectedProcedure } from '@server/api/trpc';

import { appPasswordAccountSchema, accountIdSchema, accountsSchema, oauth2AccountSchema } from './accounts.dto';
import { AccountsController } from './accounts.controller';

const accountsController = Container.get(AccountsController);

export const accountsRoutes = createTRPCRouter({
  connectGoogleOauthAccount: protectedProcedure
    .input(oauth2AccountSchema)
    .query(accountsController.connectGoogleOauthHandler),
  connectAppPasswordAccount: protectedProcedure
    .input(appPasswordAccountSchema)
    .mutation(accountsController.connectGoogleAppPasswordHandler),
  getAccounts: protectedProcedure.input(accountsSchema).query(accountsController.getAll),
  reconnectAccount: protectedProcedure.input(accountIdSchema).mutation(accountsController.reconnectAccountHandler),
  deleteAccount: protectedProcedure.input(accountIdSchema).mutation(accountsController.deleteAccountHandler),
});
