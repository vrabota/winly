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
import { randomId, useListState } from '@mantine/hooks';

import { Delete } from '@assets/icons';

import type { ReactNode } from 'react';

type FiltersProps = {
  actionBox?: ReactNode;
};

const initialValues = [
  { label: 'Receive email notifications', checked: false, key: randomId() },
  { label: 'Receive sms notifications', checked: false, key: randomId() },
  { label: 'Receive push notifications', checked: false, key: randomId() },
];

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

export const Filters = (props: FiltersProps) => {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const [values, handlers] = useListState(initialValues);
  const [opened, setOpened] = useState(false);

  const filterApplied = true;

  const allChecked = values.every(value => value.checked);
  const indeterminate = values.some(value => value.checked) && !allChecked;
  const items = values.map((value, index) => (
    <Checkbox
      className={classes.checkBox}
      label={value.label}
      key={value.key}
      checked={value.checked}
      onChange={event => handlers.setItemProp(index, 'checked', event.currentTarget.checked)}
    />
  ));
  return (
    <Grid my={20} align="center">
      <Grid.Col span={4}>
        <Input
          size="lg"
          placeholder="Search"
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
              <Menu position="bottom-start" opened={opened} onChange={setOpened} width={350}>
                <Menu.Target>
                  <Badge
                    classNames={{ root: classes.badge }}
                    sx={{ borderColor: filterApplied ? theme.colors.purple?.[6] : theme.colors.gray[5] }}
                    color="gray"
                    h={30}
                    size="md"
                    variant="outline"
                    rightSection={
                      <Group ml={5} align="center" spacing={5}>
                        {filterApplied && (
                          <ThemeIcon px={5} size="xs" radius="xl" sx={{ width: 'auto', fontSize: 10 }}>
                            Connected
                          </ThemeIcon>
                        )}

                        <IconChevronDown size={14} />
                      </Group>
                    }
                  >
                    Account status
                  </Badge>
                </Menu.Target>
                <Menu.Dropdown p={30}>
                  <>
                    <Box>
                      <Text size="sm" weight={500}>
                        Account status filters
                      </Text>
                      <ActionIcon
                        onClick={() => setOpened(false)}
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
                        checked={allChecked}
                        indeterminate={indeterminate}
                        label="Receive all notifications"
                        transitionDuration={0}
                        onChange={() =>
                          handlers.setState(current => current.map(value => ({ ...value, checked: !allChecked })))
                        }
                      />
                      {items}
                    </Stack>
                    <Group mt={40} grow>
                      <Button variant="light">Reset</Button>
                      <Button>Apply</Button>
                    </Group>
                  </>
                </Menu.Dropdown>
              </Menu>
            </Group>
            <Group>
              <Divider mt={4} mx={10} h={22} orientation="vertical" />
              <Anchor size="sm">Reset Filters</Anchor>
            </Group>
          </Group>
        </Box>
      </Grid.Col>
      <Grid.Col span="content">{props.actionBox}</Grid.Col>
    </Grid>
  );
};
