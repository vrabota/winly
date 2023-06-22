import chunk from 'lodash/chunk';
import flatten from 'lodash/flatten';
import difference from 'lodash/difference';

import type { Lead } from '@prisma/client';

export const createLeadsChunk = (accounts: any[], leads: any[]): Lead[][] => {
  const leadsPerAccount = Math.floor(leads.length / accounts.length); // Number of leads per account

  const leadsChunk = chunk(leads, leadsPerAccount); // Assign equal leads to each account

  const remainingLeads = difference(leads, flatten(leadsChunk)); // Get remaining leads

  const smallestChunkLength = Math.min(...leadsChunk.map(chunk => chunk.length));

  remainingLeads.forEach(lead => {
    const smallestChunkIndex = leadsChunk.findIndex(chunk => chunk.length === smallestChunkLength);
    leadsChunk?.[smallestChunkIndex]?.push(lead);
  });

  return leadsChunk;
};
