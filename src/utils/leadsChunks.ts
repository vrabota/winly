import chunk from 'lodash/chunk';
import flatten from 'lodash/flatten';
import difference from 'lodash/difference';
import random from 'lodash/random';

import type { Lead } from '@prisma/client';

export const createLeadsChunk = (accounts: any[], leads: any[]): Lead[][] => {
  const leadsPerAccount = Math.floor(leads.length / accounts.length); // Number of leads per account

  const leadsChunk = chunk(leads, leadsPerAccount); // Assign equal leads to each account

  const remainingLeads = difference(leads, flatten(leadsChunk)); // Get remaining leads

  remainingLeads.forEach(lead => {
    const randomIndex = random(0, accounts.length - 1);
    leadsChunk?.[randomIndex]?.push(lead);
  });

  return leadsChunk;
};
