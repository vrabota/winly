import React, { useState } from 'react';
import {
  Badge,
  Group,
  Input,
  Divider,
  Anchor,
  Grid,
  Box,
  createStyles,
  Menu,
  Text,
  ActionIcon,
  useMantineTheme,
  Checkbox,
  Stack,
  Button,
  ThemeIcon,
} from '@mantine/core';
import { IconSearch, IconChevronDown } from '@tabler/icons';
import debounce from 'lodash/debounce';

import { Delete } from '@assets/icons';

import type { ReactNode } from 'react';

type FiltersProps = {
  applyFilters?: any;
  actionBox?: ReactNode;
  searchProps?: {
    placeholder?: string;
  };
  items: {
    key: string;
    label: string;
    title: string;
    options: {
      value: string;
      label: string;
    }[];
  }[];
};

const useStyles = createStyles(theme => ({
  badge: {
    color: theme.colors.gray[7],
    transition: 'all 0.3s',
    cursor: 'pointer',
    ':hover': {
      background: theme.colors.gray[0],
    },
  },
  checkBox: {
    '.mantine-Checkbox-labelWrapper': {
      width: '100%',
    },
  },
}));

const getFilterValues = (filters: any) => {
  return Object.keys(filters).reduce((acc: any, key) => {
    if (typeof filters[key] === 'object' && filters[key].hasOwnProperty('values')) {
      acc[key] = filters[key].values.filter((item: any) => item.checked).map((item: any) => item.value);
    } else {
      acc[key] = filters[key];
    }
    return acc;
  }, {});
};

export const Filters = (props: FiltersProps) => {
  const { classes } = useStyles();
  const optionsFilters = Object.fromEntries(
    props?.items?.map(item => [
      item.key,
      {
        values: item?.options?.map(option => ({ value: option.value, label: option.label, checked: false })) || [],
        opened: false,
      },
    ]),
  );
  const [filters, setFilters] = useState<any>({ search: '', ...optionsFilters });
  const theme = useMantineTheme();

  const handleFiltersApply = (item: any) => {
    setFilters((filters: any) => ({
      ...filters,
      [item.key]: {
        ...filters[item.key],
        opened: false,
      },
    }));

    props.applyFilters(getFilterValues(filters));
  };

  const handleFiltersReset = (item: any) => {
    setFilters((filters: any) => ({
      ...filters,
      [item.key]: {
        ...filters[item.key],
        opened: false,
        values: filters[item.key].values.map((item: any) => ({
          ...item,
          checked: false,
        })),
      },
    }));
    props.applyFilters({ search: filters.search, [item.key]: [] });
  };

  const resetAllFilters = () => {
    setFilters((filters: any) => ({
      search: filters.search,
      ...optionsFilters,
    }));
    props.applyFilters({ search: filters.search, ...Object.fromEntries(props?.items?.map(item => [item.key, []])) });
  };

  const showFilterBadges = (item: any) => {
    const filterItems = filters?.[item.key]?.values?.filter((item: any) => item.checked);

    if (filterItems.length === 0) return false;
    return filterItems.length === 1
      ? filterItems[0].value === 'PAUSE'
        ? 'stopped'
        : filterItems[0].value
      : filterItems.length;
  };

  return (
    <Grid my={20} align="center">
      <Grid.Col span={4}>
        <Input
          size="lg"
          placeholder={props?.searchProps?.placeholder || 'Search'}
          onChange={debounce(e => {
            setFilters((filters: any) => ({
              ...filters,
              search: e.target.value,
            }));
            props.applyFilters({ ...getFilterValues(filters), search: e.target.value });
          }, 500)}
          icon={<IconSearch size={18} />}
          sx={theme => ({
            input: {
              borderColor: theme.colors.gray[1],
              borderRadius: theme.radius.md,
              fontSize: theme.fontSizes.md,
              paddingLeft: 50,
            },
          })}
        />
      </Grid.Col>
      <Grid.Col span="auto">
        <Box
          bg="white"
          px="xl"
          h="50px"
          sx={theme => ({
            border: `1px solid ${theme.colors.gray[1]}`,
            borderRadius: theme.radius.md,
            fontSize: theme.fontSizes.md,
            alignItems: 'center',
            display: 'flex',
          })}
        >
          <Group align="center" position="apart" w="100%">
            <Group>
              {props?.items?.map(item => (
                <Menu
                  key={item.key}
                  position="bottom-start"
                  opened={filters[item.key].opened}
                  onChange={opened =>
                    setFilters((filters: any) => ({ ...filters, [item.key]: { ...filters[item.key], opened } }))
                  }
                  width={350}
                >
                  <Menu.Target>
                    <Badge
                      classNames={{ root: classes.badge }}
                      sx={{ borderColor: !!showFilterBadges(item) ? theme.colors.purple?.[6] : theme.colors.gray[5] }}
                      color="gray"
                      h={30}
                      size="md"
                      variant="outline"
                      rightSection={
                        <Group ml={5} align="center" spacing={5}>
                          {showFilterBadges(item) && (
                            <ThemeIcon px={5} size="xs" radius="xl" sx={{ width: 'auto', fontSize: 10 }}>
                              {showFilterBadges(item)}
                            </ThemeIcon>
                          )}

                          <IconChevronDown size={14} />
                        </Group>
                      }
                    >
                      {item.label}
                    </Badge>
                  </Menu.Target>
                  <Menu.Dropdown p={30}>
                    <>
                      <Box>
                        <Text size="sm" weight={500}>
                          {item.title}
                        </Text>
                        <ActionIcon
                          onClick={() =>
                            setFilters((filters: any) => ({
                              ...filters,
                              [item.key]: { ...filters[item.key], opened: false },
                            }))
                          }
                          radius="xl"
                          size="lg"
                          sx={{ ':hover': { transition: 'all 0.3s' }, position: 'absolute', top: 10, right: 10 }}
                        >
                          <Delete color={theme.colors.dark[9]} size={12} />
                        </ActionIcon>
                      </Box>
                      <Stack mt={25} spacing="lg">
                        <Checkbox
                          className={classes.checkBox}
                          checked={filters?.[item.key]?.values?.every((value: any) => value.checked)}
                          indeterminate={
                            filters?.[item.key]?.values?.some((value: any) => value.checked) &&
                            !filters?.[item.key]?.values?.every((value: any) => value.checked)
                          }
                          label="All"
                          transitionDuration={0}
                          onChange={() =>
                            setFilters((filters: any) => ({
                              ...filters,
                              [item.key]: {
                                ...filters[item.key],
                                values: filters[item.key].values.map((item: any) => ({
                                  ...item,
                                  checked: !filters?.[item.key]?.values?.every((value: any) => value.checked),
                                })),
                              },
                            }))
                          }
                        />
                        {filters?.[item.key]?.values?.map((value: any, index: number) => (
                          <Checkbox
                            className={classes.checkBox}
                            label={value.label}
                            key={value.value}
                            checked={value.checked}
                            onChange={event => {
                              const newValues = [...filters[item.key].values];
                              newValues[index] = { ...newValues[index], checked: event.currentTarget.checked };
                              setFilters((filters: any) => ({
                                ...filters,
                                [item.key]: { ...filters[item.key], values: newValues },
                              }));
                            }}
                          />
                        ))}
                      </Stack>
                      <Group mt={40} grow>
                        <Button variant="light" onClick={() => handleFiltersReset(item)}>
                          Reset
                        </Button>
                        <Button onClick={() => handleFiltersApply(item)}>Apply</Button>
                      </Group>
                    </>
                  </Menu.Dropdown>
                </Menu>
              ))}
            </Group>
            <Group>
              <Divider mt={4} mx={10} h={22} orientation="vertical" />
              <Anchor size="sm" onClick={resetAllFilters}>
                Reset Filters
              </Anchor>
            </Group>
          </Group>
        </Box>
      </Grid.Col>
      <Grid.Col span="content" hidden={!props.actionBox}>
        {props.actionBox}
      </Grid.Col>
    </Grid>
  );
};
