import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { Title } from '@mantine/core';
import React from 'react';
import { useRouter } from 'next/router';

import { CampaignBar, CampaignItem } from '@features/campaigns';
import { api } from '@utils/api';

import type { NextPage } from 'next';

const Campaigns: NextPage = () => {
  const { push } = useRouter();
  const { data = [] } = api.campaign.getAllCampaigns.useQuery(undefined);
  return (
    <>
      <Title mb={40} order={2}>
        Campaigns
      </Title>
      <CampaignBar />
      {data.map(campaign => (
        <CampaignItem onClick={() => push(`/campaigns/${campaign.id}`)} key={campaign.id} name={campaign.name} />
      ))}
    </>
  );
};

export default withPageAuthRequired(Campaigns);
