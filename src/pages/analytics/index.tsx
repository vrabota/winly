import React from 'react';
import { Title, Stack } from '@mantine/core';

import Stats from '@features//analytics/components/Stats';
import CampaignsStats from '@features//analytics/components/CampaignsStats';
import { CampaignChart } from '@features/campaigns/components/analytics';

import type { NextPage } from 'next';

const Analytics: NextPage = () => {
  return (
    <>
      <Title mb={20} order={2}>
        Analytics
      </Title>
      <Stack spacing={30}>
        <Stats />
        <CampaignChart />
        <CampaignsStats />
      </Stack>
    </>
  );
};

export default Analytics;
