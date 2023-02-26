import React from 'react';
import { Box, Stack, Group, Text, Title, ActionIcon, Divider, TextInput } from '@mantine/core';
import { IconMail, IconTrash } from '@tabler/icons';

const SequenceTab = ({
  subject,
  isActive,
  setActive,
  deleteStep,
}: {
  subject: string;
  isActive: boolean;
  setActive: () => void;
  deleteStep: () => void;
}) => {
  return (
    <Box
      bg="gray.1"
      p={20}
      onClick={setActive}
      sx={theme => ({ borderRadius: theme.radius.md, border: isActive ? `2px solid ${theme.colors.blue[8]}` : '' })}
    >
      <Stack spacing={20}>
        <Group position="apart" align="center">
          <Group align="center">
            <IconMail />
            <Title order={6}>Step 1</Title>
          </Group>
          <ActionIcon
            onClick={e => {
              e.stopPropagation();
              deleteStep();
            }}
          >
            <IconTrash />
          </ActionIcon>
        </Group>
        <Divider mx="-20px" />
        <Stack>
          <Text>{subject || '<Empty subject>'}</Text>
        </Stack>
        <Divider mx="-20px" />
        {/*<Group>*/}
        {/*  <Text weight="bolder">Wait for </Text>*/}
        {/*  <TextInput sx={{ input: { textAlign: 'center' } }} w={50} />*/}
        {/*  <Text weight="bolder">days, then</Text>*/}
        {/*</Group>*/}
      </Stack>
    </Box>
  );
};

export default SequenceTab;
