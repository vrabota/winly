import React from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { Grid, Stack, Button } from '@mantine/core';

import { CampaignTabs } from '@features/campaigns';
import { SequenceTab, SequenceEditor } from '@features/sequences';

import type { NextPage } from 'next';

const Sequences: NextPage = () => {
  return (
    <>
      <CampaignTabs />
      <Grid gutter={40} my={20}>
        <Grid.Col span={3}>
          <Stack>
            <SequenceTab />
            <SequenceTab />
            <Button variant="outline">Add Step</Button>
          </Stack>
        </Grid.Col>
        <Grid.Col span="auto">
          <SequenceEditor />
        </Grid.Col>
      </Grid>
    </>
  );
};

export default withPageAuthRequired(Sequences);
