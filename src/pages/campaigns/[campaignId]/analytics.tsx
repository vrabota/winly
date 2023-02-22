import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import React from 'react';

import { CampaignTabs } from '@features/campaigns';

import type { NextPage } from 'next';

const CampaignDetailsAnalytics: NextPage = () => {
  return (
    <>
      <CampaignTabs />
      <div>CampaignDetailsAnalytics</div>
    </>
  );
};

export default withPageAuthRequired(CampaignDetailsAnalytics);
