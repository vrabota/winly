import React, { useContext } from 'react';
import { Text, Paper, Box } from '@mantine/core';
import { useRouter } from 'next/router';

import { Table } from '@components/data';
import { api } from '@utils/api';
import { OrganizationContext } from '@context/OrganizationContext';

import { useActivityColsDef } from './activityCols.def';

const ActivityHistory = () => {
  const { query } = useRouter();
  const { selectedOrganization } = useContext(OrganizationContext);
  const { data, isLoading, isFetching } = api.activity.getActivities.useQuery({
    campaignId: query.campaignId as string,
    organizationId: selectedOrganization?.id as string,
  });
  const { columns } = useActivityColsDef();
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
          mantineTableContainerProps={{ sx: { maxHeight: '340.77px', overflow: 'auto !important' } }}
        />
      </Box>
    </Paper>
  );
};

export default ActivityHistory;
