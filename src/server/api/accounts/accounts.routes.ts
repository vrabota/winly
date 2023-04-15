import { createTRPCRouter, protectedProcedure } from '@server/api/trpc';
import { oauth2AccountSchema } from '@server/api/accounts/data/dtos';
import {
  connectGoogleAppPasswordHandler,
  connectGoogleOauthHandler,
  deleteAccountHandler,
  getAccountsHandler,
  reconnectAccountHandler,
} from '@server/api/accounts/controllers';
import { appPasswordAccountSchema, accountIdSchema } from '@server/api/accounts/data/dtos/accounts.dto';

export const accountsRoutes = createTRPCRouter({
  connectGoogleOauthAccount: protectedProcedure.input(oauth2AccountSchema).query(connectGoogleOauthHandler),
  connectAppPasswordAccount: protectedProcedure
    .input(appPasswordAccountSchema)
    .mutation(connectGoogleAppPasswordHandler),
  getAccounts: protectedProcedure.query(getAccountsHandler),
  reconnectAccount: protectedProcedure.input(accountIdSchema).mutation(reconnectAccountHandler),
  deleteAccount: protectedProcedure.input(accountIdSchema).mutation(deleteAccountHandler),
});
