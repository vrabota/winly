import React from 'react';
import { AppShell } from '@mantine/core';

import Header from './Header';
import NavBar from './NavBar';
import { useStyles } from './styles';

import type { ReactNode } from 'react';

const MainLayout = ({ children }: { children: ReactNode }) => {
  const { classes } = useStyles();
  return (
    <AppShell header={<Header />} navbar={<NavBar />} py={30} px={50} className={classes.main}>
      {children}
    </AppShell>
  );
};

export default MainLayout;
