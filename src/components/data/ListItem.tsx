import React from 'react';
import { ActionIcon, createStyles, Group, Paper, Stack, Text } from '@mantine/core';
import { IconDots, IconSettings } from '@tabler/icons';

const useStyles = createStyles(() => ({
  campaign: {
    transition: 'all 0.3s',
    '&:hover': { boxShadow: 'rgb(0 0 0 / 8%) 0px 2px 4px, rgb(0 0 0 / 10%) 0px 2px 12px;' },
  },
}));

export const ListItem = ({ name, onClick }: { name?: string; onClick?: () => void }) => {
  const { classes } = useStyles();
  return (
    <Stack my={20} onClick={onClick}>
      <Paper shadow="sm" p="lg" radius="md" className={classes.campaign}>
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
