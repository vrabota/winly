import { type NextPage } from 'next';
import React from 'react';
import { Title } from '@mantine/core';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';

import { api } from '@utils/api';
import { AccountBar, AccountItem } from '@features/accounts';
import { useConnectAccount } from '@features/accounts/hooks';

const Home: NextPage = () => {
  const { data } = api.account.getAccounts.useQuery(undefined);
  const accounts = data?.accounts || [];
  useConnectAccount();
  return (
    <>
      <Title mb={40} order={2}>
        Email Accounts
      </Title>
      <AccountBar />
      {accounts.map(account => (
        <AccountItem key={account.email} name={account.name} />
      ))}
    </>
  );
};

export default withPageAuthRequired(Home);
