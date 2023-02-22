import React from 'react';
import { useRouter } from 'next/router';
import { Tabs } from '@mantine/core';

const CampaignTabs = () => {
  const router = useRouter();
  const path = router.pathname.split('/');
  const activeTab = path[path.length - 1];
  return (
    <Tabs value={activeTab} onTabChange={value => router.push(`/campaigns/${router.query?.campaignId}/${value}`)}>
      <Tabs.List>
        <Tabs.Tab sx={{ fontSize: 16 }} value="analytics">
          Analytics
        </Tabs.Tab>
        <Tabs.Tab sx={{ fontSize: 16 }} value="leads">
          Leads
        </Tabs.Tab>
        <Tabs.Tab sx={{ fontSize: 16 }} value="sequences">
          Sequences
        </Tabs.Tab>
        <Tabs.Tab sx={{ fontSize: 16 }} value="options">
          Options
        </Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
};

export default CampaignTabs;
