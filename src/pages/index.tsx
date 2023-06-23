import { type NextPage } from 'next';
import React, { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { ActionIcon, Menu, Stack, Text, Title, Tooltip, Group, Button } from '@mantine/core';
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
import { Trash, Sync, WarmupOn, WarmupOff } from '@assets/icons';
import { OrganizationContext } from '@context/OrganizationContext';

import type { UIEvent } from 'react';

const Home: NextPage = () => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const { selectedOrganization } = useContext(OrganizationContext);
  const [filters, applyFilters] = useState<{ accountState?: AccountState[]; search?: string }>();
  const { mutate: mutateEnableWarmup, isLoading: isLoadingWarmupEnable } = api.warmup.enableWarmup.useMutation();
  const [activeActionButton, setActiveActionButton] = useState('');
  const {
    data: accountsData,
    refetch,
    isLoading,
    isFetching,
    fetchNextPage,
  } = api.account.getAccounts.useInfiniteQuery(
    {
      limit: 20,
      organizationId: selectedOrganization?.id as string,
      accountState: filters?.accountState && filters?.accountState?.length > 0 ? filters?.accountState : undefined,
      search: filters?.search && filters?.search?.length > 0 ? filters?.search : undefined,
    },
    {
      getNextPageParam: lastPage => lastPage.nextCursor,
    },
  );
  const data = useMemo(() => accountsData?.pages.flatMap(page => page.items) ?? [], [accountsData]);
  const { mutateReconnect } = useReconnectAccount();
  const { mutateDeleteAccount } = useDeleteAccount();
  const { columns } = useAccountsColDef();
  useConnectAccount();
  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        if (scrollHeight - scrollTop - clientHeight < 300 && !isFetching) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching],
  );

  return (
    <>
      <Title mb={20} order={2}>
        Email Accounts
      </Title>
      <Table
        columns={columns}
        data={data}
        isFetching={isFetching}
        isLoading={isLoading}
        isEmpty={Array.isArray(data) && data?.length === 0 && !isFetching}
        renderTopToolbarCustomActions={() => {
          return (
            <Stack
              bg="#fcfcfc"
              py="md"
              px="xl"
              mih={68}
              justify="center"
              mb={2}
              w="100%"
              sx={theme => ({
                borderTopLeftRadius: theme.radius.md,
                borderTopRightRadius: theme.radius.md,
              })}
            >
              <Group position="apart" align="center">
                <Text size={15} color="gray.8">
                  {`Total of ${data?.length || 0} accounts`}
                </Text>
                <Tooltip label="Refetch accounts data" withArrow>
                  <ActionIcon loading={isFetching} color="purple" variant="light" size="lg" onClick={() => refetch()}>
                    <Sync size={16} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Stack>
          );
        }}
        mantineTableContainerProps={{
          ref: tableContainerRef,
          onScroll: (event: UIEvent<HTMLDivElement>) => fetchMoreOnBottomReached(event.target as HTMLDivElement),
          sx: {
            maxHeight: '600px',
          },
        }}
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
            <Group position="right" spacing="xl" align="center">
              <Button
                onClick={e => {
                  e.stopPropagation();
                  setActiveActionButton(row.original.id);
                  mutateEnableWarmup({ accountId: row.original.id });
                }}
                variant="light"
                radius="md"
                loading={isLoadingWarmupEnable && activeActionButton === row.original.id}
                leftIcon={row.original.warmupState ? <WarmupOff size={16} /> : <WarmupOn size={16} />}
              >
                {row.original.warmupState ? 'Disable Warmup' : 'Enable Warmup'}
              </Button>
              <Menu position="bottom-end" width={200} arrowOffset={30} withArrow>
                <Menu.Target>
                  <ActionIcon radius="md" size="lg">
                    <IconDots size={26} />
                  </ActionIcon>
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
            </Group>
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
