import { type NextPage } from 'next';
import React, { useContext, useState } from 'react';
import { ActionIcon, Menu, Stack, Text, Title, Tooltip } from '@mantine/core';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import { IconDots } from '@tabler/icons';
import { AccountState } from '@prisma/client';

import { api } from '@utils/api';
import { useConnectAccount, useDeleteAccount, useReconnectAccount } from '@features/accounts/hooks';
import { Table, Filters } from '@components/data';
import ConnectAccount from '@features/accounts/components/ConnectAccount';
import { useAccountsColDef } from '@features/accounts/col.def';
import noDataImage from '@assets/images/no-data.png';
import { Trash, Sync } from '@assets/icons';
import { OrganizationContext } from '@context/OrganizationContext';

const Home: NextPage = () => {
  const { selectedOrganization } = useContext(OrganizationContext);
  const [filters, applyFilters] = useState<{ accountState?: AccountState[]; search?: string }>();
  const { data, isLoading, isFetching } = api.account.getAccounts.useQuery({
    organizationId: selectedOrganization?.id as string,
    accountState: filters?.accountState && filters?.accountState?.length > 0 ? filters?.accountState : undefined,
    search: filters?.search && filters?.search?.length > 0 ? filters?.search : undefined,
  });
  console.log(filters);
  const { mutateReconnect } = useReconnectAccount();
  const { mutateDeleteAccount } = useDeleteAccount();
  const { columns } = useAccountsColDef();
  useConnectAccount();

  return (
    <>
      <Title mb={20} order={2}>
        Email Accounts
      </Title>
      <Table
        total={`Total of ${data?.length || 0} accounts`}
        columns={columns}
        data={data}
        isFetching={isFetching}
        isLoading={isLoading}
        isEmpty={Array.isArray(data) && data?.length === 0 && !isFetching}
        filters={
          <Filters
            applyFilters={applyFilters}
            items={[
              {
                key: 'accountState',
                label: 'Account state',
                title: 'Account status filters',
                options: [
                  { value: AccountState.CONNECTING, label: 'Connecting' },
                  { value: AccountState.CONNECTED, label: 'Connected' },
                  { value: AccountState.ERROR, label: 'Has errors' },
                  { value: AccountState.DISCONNECTED, label: 'Disconnected' },
                ],
              },
            ]}
            actionBox={<ConnectAccount />}
          />
        }
        renderRowActions={({ row }) => {
          return (
            <Menu position="bottom-end" width={200} arrowOffset={30} withArrow>
              <Menu.Target>
                <Tooltip label="Row actions" openDelay={200} withArrow>
                  <ActionIcon radius="md" size="lg">
                    <IconDots size={26} />
                  </ActionIcon>
                </Tooltip>
              </Menu.Target>
              <Menu.Dropdown py={10}>
                <Menu.Item onClick={() => mutateReconnect({ accountId: row.original?.id })} icon={<Sync size={14} />}>
                  Reconnect account
                </Menu.Item>
                <Menu.Item
                  onClick={() => mutateDeleteAccount({ accountId: row.original?.id })}
                  color="red"
                  icon={<Trash size={14} />}
                >
                  Delete account
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          );
        }}
        localization={{
          noRecordsToDisplay: (
            <Stack align="center" justify="center">
              <Image height={200} src={noDataImage} alt="No data iamge" />
              <Text mt={20} size="lg" weight="500" sx={{ fontStyle: 'normal' }}>
                There is no data for your request.
              </Text>
              <Text size="lg" weight="500" mb={30} sx={{ fontStyle: 'normal' }}>
                Add an account to get started.
              </Text>
              <ConnectAccount />
            </Stack>
          ),
        }}
      />
    </>
  );
};

export default withPageAuthRequired(Home);
