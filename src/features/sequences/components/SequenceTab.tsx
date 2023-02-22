import React from 'react';
import { Box, Stack, Group, Text, Title, ActionIcon, Divider, TextInput } from '@mantine/core';
import { IconMail, IconTrash } from '@tabler/icons';

const SequenceTab = () => {
  return (
    <Box bg="gray.1" p={20} sx={theme => ({ borderRadius: theme.radius.md })}>
      <Stack spacing={20}>
        <Group position="apart" align="center">
          <Group align="center">
            <IconMail />
            <Title order={6}>Step 1</Title>
          </Group>
          <ActionIcon>
            <IconTrash />
          </ActionIcon>
        </Group>
        <Divider mx="-20px" />
        <Stack>
          <Text>Drive 45% cost savings while hiring product teams x7 faster</Text>
        </Stack>
        <Divider mx="-20px" />
        <Group>
          <Text weight="bolder">Wait for </Text>
          <TextInput sx={{ input: { textAlign: 'center' } }} w={50} />
          <Text weight="bolder">days, then</Text>
        </Group>
      </Stack>
    </Box>
  );
};

export default SequenceTab;
