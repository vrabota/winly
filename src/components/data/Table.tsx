import React from 'react';
import { MantineReactTable } from 'mantine-react-table';
import { Stack, Box, Text } from '@mantine/core';

import type { ReactNode } from 'react';

const Table = ({
  columns,
  data,
  isLoading,
  isFetching,
  isEmpty,
  noData,
  filters,
  total,
  renderRowActionMenuItems,
  renderRowActions,
  ...rest
}: {
  columns: any;
  data: any;
  localization?: any;
  mantineTableContainerProps?: any;
  renderRowActionMenuItems?: (props: any) => ReactNode;
  renderRowActions?: (props: any) => ReactNode;
  mantineTableBodyRowProps?: any;
  isLoading?: boolean;
  isFetching?: boolean;
  enableRowSelection?: boolean;
  enableRowActions?: boolean;
  isEmpty?: boolean;
  noData?: ReactNode;
  filters?: ReactNode;
  total?: ReactNode | string;
  positionToolbarAlertBanner?: any;
  getRowId?: (row: any) => string;
  renderTopToolbarCustomActions?: (data: any) => ReactNode;
}) => {
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
          <Text size={15}>{total}</Text>
        </Stack>
      )}

      <Box sx={{ '.mantine-Paper-root > div': { overflow: 'visible' } }}>
        <MantineReactTable
          enableColumnActions={false}
          enableColumnFilters={false}
          enablePagination={false}
          enableSorting={false}
          enableBottomToolbar={false}
          enableTopToolbar={true}
          enableToolbarInternalActions={false}
          mantineTopToolbarProps={{
            mih: 0,
            sx: theme => ({
              '> div': { padding: 0 },
              borderTopLeftRadius: theme.radius.md,
              borderTopRightRadius: theme.radius.md,
            }),
          }}
          enableRowActions={true}
          positionActionsColumn="last"
          mantineProgressProps={{ color: 'purple.2', size: 'xs' }}
          renderRowActionMenuItems={renderRowActionMenuItems}
          renderRowActions={renderRowActions}
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
          mantinePaperProps={{
            withBorder: false,
            shadow: undefined,
          }}
          columns={columns}
          data={data || []}
          state={{ showProgressBars: isFetching, isLoading: isLoading }}
          {...rest}
        />
      </Box>
    </>
  );
};

export default Table;
