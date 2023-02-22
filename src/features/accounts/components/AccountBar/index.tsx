import React from 'react';
import { ActionIcon, Box, Button, Group, Input } from '@mantine/core';
import { IconFilter, IconSearch } from '@tabler/icons';

import ConnectAccount from '../ConnectAccount';

const AccountBar = () => {
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
      <ConnectAccount />
    </Group>
  );
};

export default AccountBar;
