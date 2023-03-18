import React from 'react';
import { MantineReactTable } from 'mantine-react-table';
import { Stack, Text, Box } from '@mantine/core';

import TableRowSkeleton from '@components/data/TableRowSkeleton';

import type { ReactNode } from 'react';

const Table = ({
  columns,
  data,
  isLoading,
  isEmpty,
  noData,
  filters,
  total,
  renderRowActionMenuItems,
}: {
  columns: any;
  data: any;
  isLoading?: boolean;
  isEmpty?: boolean;
  noData?: ReactNode;
  filters?: ReactNode;
  total?: string;
  renderRowActionMenuItems: () => ReactNode;
}) => {
  if (isLoading) {
    return (
      <>
        {filters}
        <TableRowSkeleton columnsCount={5} rowsCount={3} />
      </>
    );
  }
  if (isEmpty && noData) return <>{noData}</>;
  return (
    <>
      {filters}
      {total && (
        <Stack
          bg="#fcfcfc"
          py="md"
          px="xl"
          mb={2}
          sx={theme => ({ borderTopLeftRadius: theme.radius.md, borderTopRightRadius: theme.radius.md })}
        >
          <Text size="sm" color="gray.8">
            {total}
          </Text>
        </Stack>
      )}

      <Box sx={{ '.mantine-Paper-root > div': { overflow: 'visible' } }}>
        <MantineReactTable
          enableColumnActions={false}
          enableColumnFilters={false}
          enablePagination={false}
          enableSorting={false}
          enableBottomToolbar={false}
          enableTopToolbar={false}
          enableRowActions={true}
          positionActionsColumn="last"
          displayColumnDefOptions={{
            'mrt-row-actions': {
              size: 100,
              mantineTableHeadCellProps: {
                align: 'right',
              },
              mantineTableBodyCellProps: {
                align: 'right',
              },
            },
          }}
          renderRowActionMenuItems={renderRowActionMenuItems}
          columns={columns}
          mantinePaperProps={{
            withBorder: false,
            shadow: undefined,
          }}
          data={data || []}
        />
      </Box>
    </>
  );
};

export default Table;
