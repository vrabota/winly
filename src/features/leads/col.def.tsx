import { Avatar, Badge, Box, Text } from '@mantine/core';
import React, { useMemo } from 'react';

import { getInitials } from '@utils/getInitials';
import { LEAD_STATUS_MAPPING } from '@features/leads/utils';

import type { Lead, LeadStatus } from '@prisma/client';
import type { MRT_ColumnDef } from 'mantine-react-table';

export const useLeadsColDef = () => {
  const columns = useMemo<MRT_ColumnDef<Lead>[]>(
    () => [
      {
        accessorFn: row => `${row.firstName} ${row.lastName}`,
        id: 'email',
        header: 'Email',
        Cell: ({ row }) => {
          return (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <Avatar color="purple" radius="xl">
                <Text sx={{ textTransform: 'uppercase' }}>{getInitials(row.original.email as string)}</Text>
              </Avatar>
              <Text>{row.original.email}</Text>
            </Box>
          );
        },
      },
      {
        accessorFn: row => `${row.firstName} ${row.lastName}`,
        header: 'Name',
        Cell: ({ renderedCellValue, row }) => {
          return row.original.firstName && row.original.lastName ? (
            renderedCellValue
          ) : (
            <Text color="gray.6">Not specified</Text>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        Cell: ({ row }) => {
          const { text, color } = LEAD_STATUS_MAPPING[row.original.status as LeadStatus];
          return <Badge color={color}>{text}</Badge>;
        },
      },
      {
        accessorKey: 'companyName',
        header: 'Company',
        Cell: ({ renderedCellValue }) => {
          return renderedCellValue || <Text color="gray.6">Not specified</Text>;
        },
      },
    ],
    [],
  );
  return { columns };
};
