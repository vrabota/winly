import {
  Stack,
  Group,
  Avatar,
  Badge,
  Divider,
  TypographyStylesProvider,
  Text,
  Paper,
  Loader,
  Center,
} from '@mantine/core';
import React from 'react';
import dayjs from 'dayjs';
import capitalize from 'lodash/capitalize';

import { api } from '@utils/api';
import { getInitials } from '@utils/getInitials';

const RepliedThread = ({ activeThread }: { activeThread: any }) => {
  const { data, isLoading } = api.activity.getRepliedThread.useQuery({
    accountId: activeThread?.accountId,
    threadId: activeThread?.threadId,
  });
  if (isLoading) {
    return (
      <Center my={50}>
        <Loader />
      </Center>
    );
  }
  return (
    <Stack spacing={2}>
      {data?.map(message => (
        <Paper mb={20} key={message.id} bg="white" radius="md" shadow="xs">
          <Stack p={25}>
            <Group align="flex-start">
              <Avatar color="purple" radius="xl" size={45}>
                <Text sx={{ textTransform: 'uppercase' }}>{getInitials(message?.from?.name as string)}</Text>
              </Avatar>
              <Stack spacing={3} sx={{ flex: 1 }}>
                <Group position="apart" align="flex-start">
                  <Group my={5}>
                    <Text weight={600}>{message?.from?.address}</Text>
                    {message?.lead?.status && <Badge>{capitalize(message.lead.status.replaceAll('_', ' '))}</Badge>}
                  </Group>
                  <Text size="xs" color="gray.7">
                    {dayjs(message.date).format('MMM DD, YYYY, HH:mm')}
                  </Text>
                </Group>
                <Text weight={500}>{message?.subject}</Text>
                <Text>to: {message?.to?.map(item => item.address).join(', ')}</Text>
              </Stack>
            </Group>
            <Divider color="gray.1" mb={10} />
            <TypographyStylesProvider
              sx={theme => ({
                blockquote: {
                  fontSize: theme.fontSizes.sm,
                  color: theme.colors.gray[7],
                },
              })}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: message?.bodyText?.html,
                }}
              />
            </TypographyStylesProvider>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
};

export default RepliedThread;
