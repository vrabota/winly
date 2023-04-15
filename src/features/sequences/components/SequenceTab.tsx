import React from 'react';
import { Stack, Group, Text, ActionIcon, Divider, TextInput, Paper } from '@mantine/core';

import { Trash, Envelope } from '@assets/icons';

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
    <Paper
      bg="white"
      p={20}
      shadow="xs"
      onClick={setActive}
      sx={theme => ({
        borderRadius: theme.radius.md,
        border: isActive ? `1px solid #9537E1` : '1px solid transparent',
      })}
    >
      <Stack spacing={20}>
        <Group position="apart" align="center">
          <Group align="center">
            <Envelope size={18} />
            <Text size={14} weight={500}>{`Step ${index + 1}`}</Text>
          </Group>
          <ActionIcon
            radius="xl"
            onClick={e => {
              e.stopPropagation();
              deleteStep();
            }}
          >
            <Trash size={18} />
          </ActionIcon>
        </Group>
        {!isFirst && (
          <>
            <Divider mx="-20px" color="gray.1" />
            <Group>
              <Text weight={500} size={14}>
                Wait for{' '}
              </Text>
              <TextInput
                value={delay}
                onChange={e => updateSequence({ delay: e.target.value })}
                sx={{ input: { textAlign: 'center' } }}
                w={70}
                size="xs"
              />
              <Text weight={500} size={14}>
                days, then
              </Text>
            </Group>
          </>
        )}
        <Divider mx="-20px" color="gray.1" />
        <Stack>
          <Text size={14}>{subject || '<Empty subject>'}</Text>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default SequenceTab;
