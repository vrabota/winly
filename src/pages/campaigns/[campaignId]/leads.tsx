import React from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { IconPlus } from '@tabler/icons';
import { Button } from '@mantine/core';
import { useRouter } from 'next/router';
import { useDisclosure } from '@mantine/hooks';

import { CampaignTabs } from '@features/campaigns';
import { Filters, ListItem } from '@components/data';
import { api } from '@utils/api';
import { Modal } from '@components/overlays';
import AddLeadsForm from '@features/leads/components/AddLeadsForm';

import type { NextPage } from 'next';

const Leads: NextPage = () => {
  const { query } = useRouter();
  const [leadsOpened, { open: leadsOpen, close: leadsClose }] = useDisclosure(false);
  const { data = [] } = api.leads.getLeads.useQuery({ campaignId: query.campaignId as string });
  return (
    <>
      <CampaignTabs />
      <Filters
        actionBox={
          <Button onClick={leadsOpen} leftIcon={<IconPlus size={18} />}>
            Add New Leads
          </Button>
        }
      />
      {data.map(lead => (
        <ListItem key={lead.id} name={lead.email} />
      ))}
      <Modal
        title={`Import leads`}
        subtitle={`Please select import method and import your contacts.`}
        size={700}
        opened={leadsOpened}
        open={leadsOpen}
        close={leadsClose}
      >
        <AddLeadsForm onClose={leadsClose} />
      </Modal>
    </>
  );
};

export default withPageAuthRequired(Leads);
