import { createTRPCRouter, protectedProcedure } from '@server/api/trpc';
import { oauth2AccountSchema } from '@server/api/accounts/data/dtos';
import {
  connectGoogleAppPasswordHandler,
  connectGoogleOauthHandler,
  getAccountsHandler,
} from '@server/api/accounts/controllers';
import { appPasswordAccountSchema } from '@server/api/accounts/data/dtos/accounts.dto';

export const accountsRoutes = createTRPCRouter({
  connectGoogleOauthAccount: protectedProcedure.input(oauth2AccountSchema).query(connectGoogleOauthHandler),
  connectAppPasswordAccount: protectedProcedure
    .input(appPasswordAccountSchema)
    .mutation(connectGoogleAppPasswordHandler),
  getAccounts: protectedProcedure.query(getAccountsHandler),
});
