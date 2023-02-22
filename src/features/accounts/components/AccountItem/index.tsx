import React from 'react';
import { ActionIcon, Group, Paper, Stack, Text } from '@mantine/core';
import { IconDots, IconSettings } from '@tabler/icons';

import { useStyles } from './styles';

const AccountItem = ({ name }: { name?: string }) => {
  const { classes } = useStyles();
  return (
    <Stack my={20}>
      <Paper shadow="sm" p="lg" radius="md" className={classes.account}>
        <Group position="apart">
          <Text weight="bolder">{name}</Text>
          <Group>
            <ActionIcon>
              <IconSettings size={22} />
            </ActionIcon>
            <ActionIcon>
              <IconDots size={22} />
            </ActionIcon>
          </Group>
        </Group>
      </Paper>
    </Stack>
  );
};

export default AccountItem;
