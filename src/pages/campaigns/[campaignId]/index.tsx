import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { Title } from '@mantine/core';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

import { CampaignBar } from '@features/campaigns';
import { api } from '@utils/api';

import type { NextPage } from 'next';

const CampaignDetails: NextPage = () => {
  const { query, push } = useRouter();
  useEffect(() => {
    push(`/campaigns/${query?.campaignId}/analytics`);
  }, [push, query?.campaignId]);
  const { data } = api.campaign.getCampaignById.useQuery({ campaignId: query?.campaignId as string });
  return (
    <>
      <Title mb={40} order={2}>
        Campaign Details
      </Title>
      <CampaignBar />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
};

export default withPageAuthRequired(CampaignDetails);
