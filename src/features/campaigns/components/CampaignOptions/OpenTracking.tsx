import React from 'react';
import { Group, Paper, Stack, ThemeIcon, Text } from '@mantine/core';
import { IconDeviceWatch } from '@tabler/icons';

import { SwitchField } from '@components/form';

const OpenTracking = () => {
  return (
    <Stack align="center" spacing={20}>
      <Paper shadow="md" p="xl" radius="md" w={800}>
        <Stack spacing={30}>
          <Stack spacing={20}>
            <Group>
              <ThemeIcon radius="xl" size="xl">
                <IconDeviceWatch />
              </ThemeIcon>
              <Text weight={500}>Open tracking</Text>
            </Group>
            <Text>Track email opens</Text>
          </Stack>
          <SwitchField size="xl" onLabel="ON" offLabel="OFF" name="openTracking" />
        </Stack>
      </Paper>
    </Stack>
  );
};

export default OpenTracking;
