import React from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { IconPlus } from '@tabler/icons';
import { Button } from '@mantine/core';
import { useRouter } from 'next/router';

import { CampaignTabs } from '@features/campaigns';
import { addLeadsModal } from '@features/leads';
import { Filters, ListItem } from '@components/data';
import { api } from '@utils/api';

import type { NextPage } from 'next';

const Leads: NextPage = () => {
  const { query } = useRouter();
  const { data = [] } = api.leads.getLeads.useQuery({ campaignId: query.campaignId as string });
  return (
    <>
      <CampaignTabs />
      <Filters
        actionBox={
          <Button onClick={addLeadsModal} leftIcon={<IconPlus size={18} />}>
            Add New Leads
          </Button>
        }
      />
      {data.map(lead => (
        <ListItem key={lead.id} name={lead.email} />
      ))}
    </>
  );
};

export default withPageAuthRequired(Leads);
