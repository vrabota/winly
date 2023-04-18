import { Avatar, Badge, Box, Group, Text, Tooltip, Anchor } from '@mantine/core';
import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import Link from 'next/link';
import { ActivityStatus } from '@prisma/client';

import { getInitials } from '@utils/getInitials';
import { StatsIcon } from '@components/data';
import { MailSend, MailReply, BookOpen } from '@assets/icons';
import { CAMPAIGN_STATUS_MAPPING } from '@features/campaigns/utils';

import type { CampaignStatus } from '@prisma/client';
import type { MRT_ColumnDef } from 'mantine-react-table';
import type { CampaignWithStats } from '@server/api/campaigns/data/dtos';

export const useCampaignColDef = ({ nameWidth = 250 }) => {
  const columns = useMemo<MRT_ColumnDef<CampaignWithStats>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        size: nameWidth,
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
        size: 100,
        Cell: ({ row }) => {
          const { text, color } = CAMPAIGN_STATUS_MAPPING[row.original.status as CampaignStatus] || {};
          return <Badge color={color}>{text}</Badge>;
        },
      },
      {
        id: 'stats',
        header: 'Stats',
        Cell: ({ row }) => {
          return (
            <Group align="center" spacing={10}>
              <Tooltip label="Sent past week" openDelay={200} withArrow>
                <StatsIcon
                  icon={<MailSend size={15} />}
                  count={row?.original?.stats?.[ActivityStatus.CONTACTED]?._count || 0}
                />
              </Tooltip>
              <Tooltip label="Opened past week" openDelay={200} withArrow>
                <StatsIcon
                  icon={<BookOpen size={15} />}
                  count={row?.original?.stats?.[ActivityStatus.OPENED]?._count || 0}
                />
              </Tooltip>
              <Tooltip label="Replied past week" openDelay={200} withArrow>
                <StatsIcon
                  icon={<MailReply size={15} />}
                  count={row?.original?.stats?.[ActivityStatus.REPLIED]?._count || 0}
                />
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
    [nameWidth],
  );
  return { columns };
};
