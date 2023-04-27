import { createTRPCRouter, protectedProcedure } from '@server/api/trpc';

import { appPasswordAccountSchema, accountIdSchema, accountsSchema, oauth2AccountSchema } from './accounts.dto';
import { AccountsController } from './accounts.controller';

export const accountsRoutes = createTRPCRouter({
  connectGoogleOauthAccount: protectedProcedure
    .input(oauth2AccountSchema)
    .query(AccountsController.connectGoogleOauthHandler),
  connectAppPasswordAccount: protectedProcedure
    .input(appPasswordAccountSchema)
    .mutation(AccountsController.connectGoogleAppPasswordHandler),
  getAccounts: protectedProcedure.input(accountsSchema).query(AccountsController.getAll),
  reconnectAccount: protectedProcedure.input(accountIdSchema).mutation(AccountsController.reconnectAccountHandler),
  deleteAccount: protectedProcedure.input(accountIdSchema).mutation(AccountsController.deleteAccountHandler),
});
