import React from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { Stack } from '@mantine/core';

import { CampaignTabs, CampaignOptions } from '@features/campaigns';

import type { NextPage } from 'next';

const Options: NextPage = () => {
  return (
    <Stack spacing={40}>
      <CampaignTabs />
      <CampaignOptions />
    </Stack>
  );
};

export default withPageAuthRequired(Options);
