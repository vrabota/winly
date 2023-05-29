import { Stack, Group, Avatar, Badge, Divider, TypographyStylesProvider, Text } from '@mantine/core';
import React from 'react';

const RepliedThread = () => {
  return (
    <Stack p={25}>
      <Group align="flex-start">
        <Avatar color="purple" radius="xl" size={45}>
          <Text sx={{ textTransform: 'uppercase' }}>SR</Text>
        </Avatar>
        <Stack spacing={3} sx={{ flex: 1 }}>
          <Group position="apart" align="flex-start">
            <Group my={5}>
              <Text weight={600}>b.lindner@lindner-und-mueller.de</Text>
              <Badge>Lead</Badge>
            </Group>
            <Text size="xs" color="gray.7">
              May 23, 2023 at 12:04 pm
            </Text>
          </Group>
          <Text weight={500}>Automatische Antwort: Bernhard , looking for Remote Developers?</Text>
          <Text>to: gabrielle.k@askindex.com</Text>
        </Stack>
      </Group>
      <Divider color="gray.1" />
      <TypographyStylesProvider>
        <div
          dangerouslySetInnerHTML={{
            __html:
              '<p>Hi Bernhard ,</p><p>Get access to the Index platform with 8000+ remote candidates on it. Our experts have already checked the level of English, references about previous work, cultural fit, ID check</p><p>Since our Sourcing & Talent Recruiting teams cannot rely on typical signals that would allow them to determine if someone is good enough for the clients, Index has developed an effective hand-picking method.</p><p>Therefore, I am thrilled to introduce Index, a hiring platform that can assist you in this regard, offering access to over 8000 high-performing developers who have been verified and vetted.</p>',
          }}
        />
      </TypographyStylesProvider>
    </Stack>
  );
};

export default RepliedThread;
