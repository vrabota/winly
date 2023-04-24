import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { Tabs, Stack, Group, ActionIcon, Title, Badge, Button } from '@mantine/core';
import Link from 'next/link';
import { CampaignStatus } from '@prisma/client';

import { ArrowLeft, Play, Pause } from '@assets/icons';
import { api } from '@utils/api';
import { CAMPAIGN_STATUS_MAPPING } from '@features/campaigns/utils';
import { OrganizationContext } from '@context/OrganizationContext';

const CampaignTabs = () => {
  const router = useRouter();
  const { selectedOrganization } = useContext(OrganizationContext);
  const { data } = api.campaign.getCampaignById.useQuery({
    campaignId: router.query.campaignId as string,
    organizationId: selectedOrganization?.id as string,
  });
  const path = router.pathname.split('/');
  const activeTab = path[path.length - 1];
  const { text, color } = CAMPAIGN_STATUS_MAPPING[data?.status as CampaignStatus] || {};
  return (
    <Stack>
      <Group align="center">
        <ActionIcon
          sx={theme => ({
            transition: 'all 0.3s',
            ':hover': { background: theme.colors.gray[1] },
          })}
          radius="xl"
          size="lg"
        >
          <Link href="/campaigns">
            <ArrowLeft size={18} color="gray" />
          </Link>
        </ActionIcon>
        <Title mt={-2} order={4}>
          {data?.name}
        </Title>
        <Badge variant="outline" color={color}>
          {text}
        </Badge>
      </Group>
      <Tabs value={activeTab} onTabChange={value => router.push(`/campaigns/${router.query?.campaignId}/${value}`)}>
        <Tabs.List>
          <Tabs.Tab sx={{ fontSize: 16 }} value="analytics">
            Analytics
          </Tabs.Tab>
          <Tabs.Tab sx={{ fontSize: 16 }} value="leads">
            Leads
          </Tabs.Tab>
          <Tabs.Tab sx={{ fontSize: 16 }} value="sequences">
            Sequences
          </Tabs.Tab>
          <Tabs.Tab sx={{ fontSize: 16 }} value="options">
            Options
          </Tabs.Tab>
          <Group ml="auto" mb={10}>
            <Button
              onClick={e => e.stopPropagation()}
              variant="outline"
              radius="md"
              leftIcon={data?.status === CampaignStatus.ACTIVE ? <Pause size={14} /> : <Play size={14} />}
              sx={theme => ({ ':hover': { backgroundColor: theme.colors.purple?.[1] } })}
            >
              {data?.status === CampaignStatus.ACTIVE ? 'Pause Campaign' : 'Start Campaign'}
            </Button>
          </Group>
        </Tabs.List>
      </Tabs>
    </Stack>
  );
};

export default CampaignTabs;
