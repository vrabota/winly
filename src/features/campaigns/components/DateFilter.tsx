import React, { useContext, useState } from 'react';
import { ActionIcon, Badge, Box, Button, Group, Menu, Select, Stack, useMantineTheme, Text } from '@mantine/core';
import dayjs from 'dayjs';
import { DateRangePicker } from '@mantine/dates';

import { CalendarIcon, Delete } from '@assets/icons';
import { CAMPAIGN_DATE_RANGE_LABELS, DateRanges } from '@features/campaigns/utils';
import { DatePeriodContext } from '@context/DatePeriodContext';

import type { DateRangePickerValue } from '@mantine/dates';

const DateFilter = () => {
  const theme = useMantineTheme();
  const { datePeriod, setDatePeriod, customDateRange, setCustomDateRange } = useContext(DatePeriodContext);
  const [dateValue, setDateValue] = useState(datePeriod);
  const [customDateRangeValue, setCustomDateRangeValue] = useState<DateRangePickerValue>(customDateRange as any);
  const [dateMenuOpened, setDateMenuOpened] = useState(false);
  return (
    <Menu
      position="bottom-end"
      opened={dateMenuOpened}
      onClose={() => setDateMenuOpened(false)}
      onOpen={() => setDateMenuOpened(true)}
      width={350}
    >
      <Menu.Target>
        <Button
          variant="outline"
          radius="md"
          leftIcon={<CalendarIcon size={14} />}
          rightIcon={
            <Badge px={5} size="xs" radius="xl">
              {datePeriod === DateRanges.CustomRange
                ? `${dayjs(customDateRange?.[0]).format('MMMM D')} - ${dayjs(customDateRange?.[1]).format('MMMM D')}`
                : CAMPAIGN_DATE_RANGE_LABELS[datePeriod as DateRanges]}
            </Badge>
          }
          sx={theme => ({ ':hover': { backgroundColor: theme.colors.purple?.[1] } })}
        >
          Date
        </Button>
      </Menu.Target>
      <Menu.Dropdown p={30}>
        <>
          <Box>
            <ActionIcon
              onClick={() => setDateMenuOpened(false)}
              radius="xl"
              size="lg"
              sx={{ ':hover': { transition: 'all 0.3s' }, position: 'absolute', top: 10, right: 10 }}
            >
              <Delete color={theme.colors.dark[9]} size={12} />
            </ActionIcon>
          </Box>
          <Stack spacing="lg">
            <Text size="sm">Select a date range period.</Text>
            <Select
              label="Select period"
              placeholder="Pick one"
              maxDropdownHeight={400}
              value={dateValue}
              onChange={value => setDateValue(value)}
              data={Object.keys(CAMPAIGN_DATE_RANGE_LABELS).map(item => ({
                value: item,
                label: CAMPAIGN_DATE_RANGE_LABELS[item as DateRanges],
              }))}
            />
            {dateValue === DateRanges.CustomRange && (
              <DateRangePicker
                label="Custom range"
                placeholder="Pick dates range"
                value={customDateRangeValue}
                onChange={setCustomDateRangeValue}
                maxDate={new Date()}
                hideOutsideDates
              />
            )}
          </Stack>
          <Group mt={40} grow>
            <Button
              onClick={() => {
                setDateValue(DateRanges.Week);
                setDatePeriod?.(DateRanges.Week);
                setDateMenuOpened(false);
                setCustomDateRange?.(undefined);
              }}
              variant="light"
            >
              Reset
            </Button>
            <Button
              onClick={() => {
                setDateMenuOpened(false);
                setDatePeriod?.(dateValue);
                setCustomDateRange?.(customDateRangeValue);
              }}
            >
              Apply
            </Button>
          </Group>
        </>
      </Menu.Dropdown>
    </Menu>
  );
};

export default DateFilter;
