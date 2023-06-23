import { Avatar, Badge, Box, Group, Text, Tooltip } from '@mantine/core';
import React, { useMemo } from 'react';

import { getInitials } from '@utils/getInitials';
import { StatsIcon } from '@components/data';
import { DownloadWebsite, FireExit, MailSend, ShieldPerson, VoiceId } from '@assets/icons';
import { ACCOUNT_STATUS_MAPPING } from '@features/accounts/utils';

import type { AccountState } from '@prisma/client';
import type { MRT_ColumnDef } from 'mantine-react-table';
import type { Account } from '@features/accounts/types';

export const useAccountsColDef = () => {
  const columns = useMemo<MRT_ColumnDef<Account>[]>(
    () => [
      {
        accessorFn: row => `${row.firstName} ${row.lastName}`,
        id: 'name',
        header: 'Name',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <Avatar src={row?.original?.picture} color="purple" radius="xl">
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
        Cell: ({ row }) => {
          const { text, color } = ACCOUNT_STATUS_MAPPING[row.original.state as AccountState] || {};
          return <Badge color={color}>{text}</Badge>;
        },
      },
      {
        id: 'stats',
        header: 'Stats',
        size: 250,
        Cell: () => {
          return (
            <Group align="center" spacing={10}>
              <Tooltip label="Campaign emails sent today" openDelay={200} withArrow>
                <StatsIcon icon={<MailSend size={15} />} count={0} />
              </Tooltip>
              <Tooltip label="Warmup emails sent past week" openDelay={200} withArrow>
                <StatsIcon icon={<FireExit size={15} />} count={0} />
              </Tooltip>
              <Tooltip label="Warmup emails landed in inbox past week" openDelay={200} withArrow>
                <StatsIcon icon={<DownloadWebsite size={15} />} count={0} />
              </Tooltip>
              <Tooltip label="Warmup emails saved from spam folder past week" openDelay={200} withArrow>
                <StatsIcon icon={<ShieldPerson size={15} />} count={0} />
              </Tooltip>
              <Tooltip label="Warmup health score" openDelay={200} withArrow>
                <StatsIcon icon={<VoiceId size={15} />} count={0} />
              </Tooltip>
            </Group>
          );
        },
      },
    ],
    [],
  );
  return { columns };
};
