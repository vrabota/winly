import { type NextPage } from 'next';
import React from 'react';
import { Menu, Stack, Text, Title } from '@mantine/core';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';

import { api } from '@utils/api';
import { useConnectAccount } from '@features/accounts/hooks';
import { Table, Filters } from '@components/data';
import ConnectAccount from '@features/accounts/components/ConnectAccount';
import { useAccountsColDef } from '@features/accounts/col.def';

import Image from 'next/image';

import noDataImage from '@assets/images/no-data.png';
import { Pencil, Trash } from '@assets/icons';

const Home: NextPage = () => {
  const { data, isLoading } = api.account.getAccounts.useQuery(undefined);
  useConnectAccount();

  const { columns } = useAccountsColDef();

  return (
    <>
      <Title mb={40} order={3}>
        Email Accounts
      </Title>
      <Table
        total={`Total of ${data?.length} accounts`}
        columns={columns}
        data={data}
        isLoading={isLoading}
        isEmpty={data?.length === 0}
        filters={<Filters actionBox={<ConnectAccount />} />}
        renderRowActionMenuItems={() => (
          <>
            <Menu.Item onClick={() => console.log(123)} icon={<Pencil size={14} />}>
              Reconnect account
            </Menu.Item>
            <Menu.Item onClick={() => null} color="red" icon={<Trash size={14} />}>
              Delete account
            </Menu.Item>
          </>
        )}
        noData={
          <Stack align="center" justify="center" my={100}>
            <Image width={337.5} height={300} src={noDataImage} alt="No data iamge" />
            <Text mt={20} size="lg" weight="500">
              There is no data for your request.
            </Text>
            <Text size="lg" weight="500" mb={30}>
              Add an account to get started.
            </Text>
            <ConnectAccount />
          </Stack>
        }
      />
    </>
  );
};

export default withPageAuthRequired(Home);
