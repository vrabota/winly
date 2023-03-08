/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1)
 * 2. You want to create a new middleware or type of procedure (see Part 3)
 *
 * tl;dr - this is where all the tRPC server stuff is created and plugged in.
 * The pieces you will need to use are documented accordingly near the end
 */

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API
 *
 * These allow you to access things like the database, the session, etc, when
 * processing a request
 *
 */

/**
 * 2. INITIALIZATION
 *
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */
import { initTRPC, TRPCError } from '@trpc/server';
import { getSession } from '@auth0/nextjs-auth0';
import superjson from 'superjson';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';

import { prisma } from '../db';

import type { User } from '@prisma/client';
import type { inferAsyncReturnType } from '@trpc/server';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Session } from '@auth0/nextjs-auth0';

/**
 * This is the actual context you'll use in your router. It will be used to
 * process every request that goes through your tRPC endpoint
 * @link https://trpc.io/docs/context
 */

export type CreateContextOptions = {
  session: Session;
  organizationId: string;
  req?: NextApiRequest;
  res?: NextApiResponse;
  user: User;
};

/**
 * This helper generates the "internals" for a tRPC context. If you need to use
 * it, you can export it from here
 *
 * Examples of things you may need it for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 */
const createInnerTRPCContext = (_opts: CreateContextOptions) => {
  return {
    req: _opts.req,
    res: _opts.res,
    session: _opts.session,
    user: _opts.user,
    organizationId: _opts.organizationId,
    prisma,
  };
};
export const createTRPCContext = async (_opts: CreateNextContextOptions) => {
  const { req, res } = _opts;
  const session = (await getSession(req, res)) as Session;
  return createInnerTRPCContext({
    session,
    req,
    res,
    user: {} as User,
    organizationId: req?.headers.organization as string,
  });
};

export type Context = inferAsyncReturnType<typeof createTRPCContext>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

const isAuthed = t.middleware(async ({ ctx, next, path }) => {
  let user = null;
  if (path !== 'info.init') {
    user = await ctx.prisma.user.findUnique({ where: { auth0Id: ctx.session.user.sub } });
  }
  if (!ctx.session || !ctx.session.user || (!user && path !== 'info.init')) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  if (!ctx?.organizationId && path !== 'info.init') {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'There is a missing organization for your request' });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
      user: user as User,
    },
  });
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the /src/server/api/routers folder
 */

/**
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
