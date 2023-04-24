import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import React from 'react';
import { Grid } from '@mantine/core';

import { CampaignTabs } from '@features/campaigns';
import {
  CampaignStats,
  CampaignStatsData,
  CampaignChart,
  StepAnalytics,
  ActivityHistory,
} from '@features/campaigns/components/analytics';

import type { NextPage } from 'next';

const CampaignDetailsAnalytics: NextPage = () => {
  return (
    <>
      <CampaignTabs />
      <Grid my={20} gutter={30}>
        <Grid.Col span={4}>
          <CampaignStats />
        </Grid.Col>
        <Grid.Col span={8}>
          <CampaignStatsData />
        </Grid.Col>
        <Grid.Col span={12}>
          <CampaignChart />
        </Grid.Col>
        <Grid.Col span={4}>
          <StepAnalytics />
        </Grid.Col>
        <Grid.Col span={8}>
          <ActivityHistory />
        </Grid.Col>
      </Grid>
    </>
  );
};

export default withPageAuthRequired(CampaignDetailsAnalytics);
