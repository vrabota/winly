import { ActionIcon, Avatar, Badge, Box, Group, Menu, Text, useMantineTheme } from '@mantine/core';
import React, { useMemo } from 'react';
import dayjs from 'dayjs';

import { getInitials } from '@utils/getInitials';
import { StatsIcon } from '@components/data';
import { DownloadWebsite, FireExit, MailSend, MenuVertical, Pencil, ShieldPerson, Trash, VoiceId } from '@assets/icons';

import type { MRT_ColumnDef } from 'mantine-react-table';
import type { Account } from '@features/accounts/types';

export const useAccountsColDef = () => {
  const theme = useMantineTheme();
  const columns = useMemo<MRT_ColumnDef<Account>[]>(
    () => [
      {
        accessorFn: row => `${row.firstName} ${row.lastName}`,
        id: 'name',
        header: 'Name',
        Cell: ({ renderedCellValue }) => {
          return (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <Avatar color="purple" radius="xl">
                <Text sx={{ textTransform: 'uppercase' }}>{getInitials(renderedCellValue as string)}</Text>
              </Avatar>
              <span>{renderedCellValue}</span>
            </Box>
          );
        },
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'state',
        header: 'Status',
        maxSize: 100,
        Cell: () => <Badge color="green">Connected</Badge>,
      },
      {
        id: 'stats',
        header: 'Stats',
        size: 280,
        Cell: () => {
          return (
            <Group align="center" spacing={10}>
              <StatsIcon icon={<MailSend size={15} />} count={0} />
              <StatsIcon icon={<FireExit size={15} />} count={0} />
              <StatsIcon icon={<DownloadWebsite size={15} />} count={0} />
              <StatsIcon icon={<ShieldPerson size={15} />} count={0} />
              <StatsIcon icon={<VoiceId size={15} />} count={0} />
            </Group>
          );
        },
      },
      {
        accessorKey: 'updatedAt',
        header: 'Last sync',
        Cell: ({ renderedCellValue }) => {
          return renderedCellValue ? dayjs(renderedCellValue?.toString()).format('MMM DD, YYYY, HH:mm') : null;
        },
      },
    ],
    [theme.colors.gray, theme.primaryColor],
  );
  return { columns };
};
