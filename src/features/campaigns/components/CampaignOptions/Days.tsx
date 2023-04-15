import React from 'react';
import { Group, Paper, Stack, ThemeIcon, Text, Checkbox } from '@mantine/core';
import { IconSun } from '@tabler/icons';

import { Skeleton } from '@components/data';
import { DayOfWeek } from '@server/types/DayOfWeek';
import { CheckboxGroup } from '@components/form';

const Days = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <Stack align="center" spacing={20}>
      <Paper shadow="md" p="xl" radius="md" w={800}>
        <Stack spacing={30}>
          <Stack spacing={20}>
            <Group>
              <ThemeIcon radius="xl" size="xl">
                <IconSun />
              </ThemeIcon>
              <Text weight={500}>Days</Text>
            </Group>
            <Text size={14}>Add days when you want to send emails to your leads?</Text>
          </Stack>
          <Skeleton isLoading={isLoading}>
            <CheckboxGroup name="days">
              {Object.values(DayOfWeek).map((day, index) => (
                <Checkbox key={day} value={`${index + 1}`} label={day} />
              ))}
            </CheckboxGroup>
          </Skeleton>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default Days;
