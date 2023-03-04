import React from 'react';
import { Box, Stack, Group, Text, Title, ActionIcon, Divider, TextInput } from '@mantine/core';
import { IconMail, IconTrash } from '@tabler/icons';

const SequenceTab = ({
  updateSequence,
  subject,
  isActive,
  isFirst,
  setActive,
  deleteStep,
  index,
  delay,
}: {
  updateSequence: ({ delay }: { delay?: string }) => void;
  subject: string;
  delay: string;
  isActive: boolean;
  isFirst: boolean;
  index: number;
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
            <Title order={6}>{`Step ${index + 1}`}</Title>
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
        {!isFirst && (
          <>
            <Divider mx="-20px" />
            <Group>
              <Text weight="bolder">Wait for </Text>
              <TextInput
                value={delay}
                onChange={e => updateSequence({ delay: e.target.value })}
                sx={{ input: { textAlign: 'center' } }}
                w={50}
              />
              <Text weight="bolder">days, then</Text>
            </Group>
          </>
        )}
        <Divider mx="-20px" />
        <Stack>
          <Text>{subject || '<Empty subject>'}</Text>
        </Stack>
      </Stack>
    </Box>
  );
};

export default SequenceTab;
