import React from 'react';
import { AppShell } from '@mantine/core';

import Header from './Header';
import NavBar from './NavBar';

import type { ReactNode } from 'react';

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <AppShell header={<Header />} navbar={<NavBar />} padding="xl">
      {children}
    </AppShell>
  );
};

export default MainLayout;
