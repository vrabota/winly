import { Avatar, Badge, Box, Text } from '@mantine/core';
import React, { useMemo } from 'react';
import dayjs from 'dayjs';

import { getInitials } from '@utils/getInitials';

import type { Activity } from '@prisma/client';
import type { MRT_ColumnDef } from 'mantine-react-table';

export const useActivityColsDef = () => {
  const columns = useMemo<MRT_ColumnDef<Activity>[]>(
    () => [
      {
        accessorKey: 'leadEmail',
        header: 'Email',
        size: 400,
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
                <Text sx={{ textTransform: 'uppercase' }}>{getInitials(row.original.leadEmail as string)}</Text>
              </Avatar>
              <Text>{row.original.leadEmail}</Text>
            </Box>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        Cell: ({ renderedCellValue }) => {
          const { text, color } = { text: renderedCellValue, color: 'blue' };
          return <Badge color={color}>{text}</Badge>;
        },
      },
      {
        accessorKey: 'step',
        header: 'Step',
        Cell: ({ renderedCellValue }) => {
          return <Badge color="purple">{`Step ${renderedCellValue}`}</Badge>;
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Date',
        Cell: ({ renderedCellValue }) => {
          return renderedCellValue ? dayjs(renderedCellValue?.toString()).format('MMM DD, YYYY, HH:mm') : null;
        },
      },
    ],
    [],
  );
  return { columns };
};
