import React from 'react';
import { AppShell, Container } from '@mantine/core';

import Header from './Header';
import NavBar from './NavBar';
import { useStyles } from './styles';

import type { ReactNode } from 'react';

const MainLayout = ({ children }: { children: ReactNode }) => {
  const { classes } = useStyles();
  return (
    <AppShell header={<Header />} footer={<div>ss</div>} navbar={<NavBar />} py={30} className={classes.main}>
      <Container size={1600}>{children}</Container>
    </AppShell>
  );
};

export default MainLayout;
