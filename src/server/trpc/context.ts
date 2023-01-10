import { type inferAsyncReturnType } from '@trpc/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { getSession } from '@auth0/nextjs-auth0';

import { prisma } from '../db/client';

import type { Session } from '@auth0/nextjs-auth0';

/**
 * Replace this with an object if you want to pass things to createContextInner
 */
type CreateContextOptions = {
  session?: Session | null;
};

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 **/
export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;
  const session = await getSession(req, res);
  return await createContextInner({
    session,
  });
};

export type Context = inferAsyncReturnType<typeof createContext>;
