import { Avatar, Badge, Box, Group, Text, Tooltip, Anchor } from '@mantine/core';
import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import Link from 'next/link';

import { getInitials } from '@utils/getInitials';
import { StatsIcon } from '@components/data';
import { MailSend, MailReply, BookOpen } from '@assets/icons';
import { CAMPAIGN_STATUS_MAPPING } from '@features/campaigns/utils';

import type { Campaign, CampaignStatus } from '@prisma/client';
import type { MRT_ColumnDef } from 'mantine-react-table';

export const useCampaignColDef = () => {
  const columns = useMemo<MRT_ColumnDef<Campaign>[]>(
    () => [
      {
        accessorKey: 'name',
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
              <Avatar color="purple" radius="xl">
                <Text sx={{ textTransform: 'uppercase' }}>{getInitials(row.original.name)}</Text>
              </Avatar>
              <Anchor weight={500} underline={false} component={Link} href={`/campaigns/${row.original.id}/analytics`}>
                {renderedCellValue}
              </Anchor>
            </Box>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        Cell: ({ row }) => {
          const { text, color } = CAMPAIGN_STATUS_MAPPING[row.original.status as CampaignStatus] || {};
          return <Badge color={color}>{text}</Badge>;
        },
      },
      {
        id: 'stats',
        header: 'Stats',
        size: 200,
        Cell: () => {
          return (
            <Group align="center" spacing={10}>
              <Tooltip label="Sent today" openDelay={200} withArrow>
                <StatsIcon icon={<MailSend size={15} />} count={0} />
              </Tooltip>
              <Tooltip label="Opened today" openDelay={200} withArrow>
                <StatsIcon icon={<BookOpen size={15} />} count={0} />
              </Tooltip>
              <Tooltip label="Replied today" openDelay={200} withArrow>
                <StatsIcon icon={<MailReply size={15} />} count={0} />
              </Tooltip>
            </Group>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Created At',
        Cell: ({ renderedCellValue }) => {
          return renderedCellValue ? dayjs(renderedCellValue?.toString()).format('MMM DD, YYYY, HH:mm') : null;
        },
      },
    ],
    [],
  );
  return { columns };
};
