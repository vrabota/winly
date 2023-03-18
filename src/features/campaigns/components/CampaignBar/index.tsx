import React from 'react';
import { ActionIcon, Box, Button, Group, Input } from '@mantine/core';
import { IconFilter, IconPlus, IconSearch } from '@tabler/icons';

import { createCampaign } from './createCampaign';

const CampaignBar = () => {
  return (
    <Group my={30} position="apart">
      <Box>
        <Group>
          <Input
            size="md"
            placeholder="Search"
            rightSection={
              <ActionIcon>
                <IconSearch size={18} />
              </ActionIcon>
            }
          />
          <Button size="md" variant="subtle" leftIcon={<IconFilter size={18} />}>
            Filter
          </Button>
        </Group>
      </Box>
      <Button onClick={createCampaign} leftIcon={<IconPlus size={18} />}>
        New Campaign
      </Button>
    </Group>
  );
};

export default CampaignBar;
