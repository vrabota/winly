import React from 'react';
import { Group, Paper, Stack, ThemeIcon, Title, Text } from '@mantine/core';
import { IconDeviceWatch } from '@tabler/icons';

import { SwitchField } from '@components/form';

const OpenTracking = () => {
  return (
    <Stack align="center" spacing={20}>
      <Paper shadow="sm" p="xl" radius="md" w={800} withBorder>
        <Stack spacing={30}>
          <Stack spacing={20}>
            <Group>
              <ThemeIcon radius="xl" size="xl">
                <IconDeviceWatch />
              </ThemeIcon>
              <Title order={4}>Open tracking</Title>
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
