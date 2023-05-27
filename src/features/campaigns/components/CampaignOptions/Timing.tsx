import React from 'react';
import { Group, Paper, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconCalendarTime } from '@tabler/icons';
import { useWatch } from 'react-hook-form';
import timeZones from 'timezones-list';

import { Skeleton } from '@components/data';
import { SelectField } from '@components/form';
import { timeData } from '@utils/constants';

const Timing = ({ isLoading }: { isLoading: boolean }) => {
  const fromValue = useWatch({ name: 'from' });
  const selectedIndex = timeData.findIndex(el => el === fromValue);
  const timezoneList = timeZones.map(item => ({ label: item.name, value: item.tzCode }));

  return (
    <Stack align="center" spacing={20}>
      <Paper shadow="md" p="xl" radius="md" w={800}>
        <Stack spacing={30}>
          <Stack spacing={20}>
            <Group>
              <ThemeIcon radius="xl" size="xl">
                <IconCalendarTime />
              </ThemeIcon>
              <Text weight={500}>Timing</Text>
            </Group>
            <Text size={14}>Add time interval and timezone when you want to send emails to your leads.</Text>
          </Stack>
          <Skeleton isLoading={isLoading}>
            <Stack>
              <Group>
                <SelectField searchable label="From" name="from" data={timeData} />
                <SelectField searchable label="To" name="to" data={timeData.slice(selectedIndex)} />
              </Group>
              <SelectField searchable label="Timezone" name="timezone" data={timezoneList} />
            </Stack>
          </Skeleton>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default Timing;
