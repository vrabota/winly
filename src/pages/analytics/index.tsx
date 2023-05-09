import React from 'react';
import { Title, Stack, Group } from '@mantine/core';

import Stats from '@features//analytics/components/Stats';
import CampaignsStats from '@features//analytics/components/CampaignsStats';
import { CampaignChart } from '@features/campaigns/components/analytics';
import DateFilter from '@features/campaigns/components/DateFilter';

import type { NextPage } from 'next';

const Analytics: NextPage = () => {
  return (
    <>
      <Group position="apart" align="center" mb={20}>
        <Title order={2}>Analytics</Title>
        <DateFilter />
      </Group>

      <Stack spacing={30}>
        <Stats />
        <CampaignChart />
        <CampaignsStats />
      </Stack>
    </>
  );
};

export default Analytics;
