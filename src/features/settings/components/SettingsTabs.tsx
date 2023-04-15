import React from 'react';
import { useRouter } from 'next/router';
import { Tabs, Title } from '@mantine/core';

const SettingsTabs = () => {
  const router = useRouter();
  const path = router.pathname.split('/');
  const activeTab = path[path.length - 1];
  return (
    <>
      <Title mb={20} order={2}>
        Settings
      </Title>
      <Tabs value={activeTab} onTabChange={value => router.push(`/settings/${value}`)}>
        <Tabs.List>
          <Tabs.Tab sx={{ fontSize: 16 }} value="workspace">
            Workspace
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
    </>
  );
};

export default SettingsTabs;
