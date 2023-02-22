import React from 'react';
import { ActionIcon, Box, Button, Group, Input } from '@mantine/core';
import { IconFilter, IconSearch } from '@tabler/icons';

import type { ReactNode } from 'react';

type FiltersProps = {
  actionBox?: ReactNode;
};

export const Filters = (props: FiltersProps) => {
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
      {props.actionBox}
    </Group>
  );
};
