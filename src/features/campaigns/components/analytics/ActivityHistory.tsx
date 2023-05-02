import React, { useCallback, useContext, useMemo, useRef } from 'react';
import { Text, Paper, Box } from '@mantine/core';
import { useRouter } from 'next/router';

import { Table } from '@components/data';
import { api } from '@utils/api';
import { OrganizationContext } from '@context/OrganizationContext';

import { useActivityColsDef } from './activityCols.def';

import type { UIEvent } from 'react';

const ActivityHistory = () => {
  const { query } = useRouter();
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const { selectedOrganization } = useContext(OrganizationContext);
  const {
    data: activityData,
    isLoading,
    isFetching,
    fetchNextPage,
  } = api.activity.getActivities.useInfiniteQuery(
    {
      limit: 20,
      campaignId: query.campaignId as string,
      organizationId: selectedOrganization?.id as string,
    },
    {
      getNextPageParam: lastPage => lastPage.nextCursor,
    },
  );
  const { columns } = useActivityColsDef();
  const data = useMemo(() => activityData?.pages.flatMap(page => page.items) ?? [], [activityData]);
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
    <Paper shadow="sm" radius="md" p="xl">
      <Text weight="500" mb={20}>
        Activity History
      </Text>
      <Box>
        <Table
          enableRowActions={false}
          columns={columns}
          data={data}
          isFetching={isFetching}
          isLoading={isLoading}
          isEmpty={Array.isArray(data) && data?.length === 0 && !isFetching}
          mantineTableContainerProps={{
            ref: tableContainerRef,
            onScroll: (event: UIEvent<HTMLDivElement>) => fetchMoreOnBottomReached(event.target as HTMLDivElement),
            sx: {
              maxHeight: '340.77px',
              overflow: 'auto !important',
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default ActivityHistory;
