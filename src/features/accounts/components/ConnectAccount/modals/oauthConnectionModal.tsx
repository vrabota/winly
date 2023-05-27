import { closeAllModals, closeModal, openConfirmModal } from '@mantine/modals';
import {
  Anchor,
  Button,
  CopyButton,
  Divider,
  Group,
  List,
  Mark,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import Image from 'next/image';
import React from 'react';
import { IconArrowLeft, IconBrandGoogle, IconCopy } from '@tabler/icons';

import GmailSVG from '@assets/svg/gmail.svg';

import { MODAL_IDS } from '../constants';

export const oauthConnectionModal = () =>
  openConfirmModal({
    modalId: MODAL_IDS.GOOGLE_OAUTH_CONNECTION_MODAL,
    size: 500,
    padding: 36,
    closeOnConfirm: false,
    confirmProps: {
      hidden: true,
    },
    closeOnClickOutside: false,
    cancelProps: {
      hidden: true,
    },
    children: (
      <>
        <Anchor
          align="justify"
          onClick={() => {
            closeModal(MODAL_IDS.GOOGLE_OAUTH_CONNECTION_MODAL);
            closeModal(MODAL_IDS.GOOGLE_SELECT_CONNECTION_MODAL);
            closeModal(MODAL_IDS.ENABLE_GOOGLE_IMAP_MODAL);
          }}
        >
          <Group spacing={15} display="inline-flex">
            <IconArrowLeft size={18} />
            <Text inline>Back to providers</Text>
          </Group>
        </Anchor>

        <Divider my="lg" size={1} variant="solid" color="gray.1" />
        <Group py={15} px={30} spacing={25}>
          <Image src={GmailSVG} width={40} height={40} alt="Gmail / G-Suite" />
          <Stack spacing={0}>
            <Title order={4}>Connect Your Google Account</Title>
            <Text color="gray.5">Gmail / G-Suite</Text>
          </Stack>
        </Group>
        <Text my={30} align="center">
          Allow EmailTool to access your Google Workspace
          <br />
          <Mark color="yellow.0">You only need to do this once per domain.</Mark>
        </Text>
        <Divider my="xl" size={1} variant="solid" color="gray.1" />
        <List spacing="lg" size="md">
          <List.Item icon={<ThemeIcon radius="xl">1</ThemeIcon>}>
            Go to your{' '}
            <Anchor href="https://admin.google.com/u/1/ac/owl/list?tab=configuredApps" target="_blank">
              Google Workspace Admin Panel
            </Anchor>
          </List.Item>
          <List.Item icon={<ThemeIcon radius="xl">2</ThemeIcon>}>
            Click{' '}
            <Text span weight="bolder">
              Add App
            </Text>{' '}
            and then select{' '}
            <Text span weight="bolder">
              {' '}
              OAuth App Name or Client ID
            </Text>
            .
          </List.Item>
          <List.Item icon={<ThemeIcon radius="xl">3</ThemeIcon>}>
            <Stack>
              <Text>Use the following Client-ID to search for EmailTool:</Text>
              <Paper sx={{ lineHeight: '1.5em' }} bg="gray.2" p={25} radius="md">
                <Text sx={{ wordBreak: 'break-word' }}>
                  564866513034-3ii3apd54pj8paj74mmmn70uq7tl1jpk.apps.googleusercontent.com
                </Text>
              </Paper>
              <CopyButton value="564866513034-3ii3apd54pj8paj74mmmn70uq7tl1jpk.apps.googleusercontent.com">
                {({ copied, copy }) => (
                  <Button leftIcon={<IconCopy size={18} />} color={copied ? 'teal' : 'purple'} onClick={copy}>
                    {copied ? 'Copied Client-ID' : 'Copy Client-ID'}
                  </Button>
                )}
              </CopyButton>
            </Stack>
          </List.Item>
          <List.Item icon={<ThemeIcon radius="xl">4</ThemeIcon>}>
            Select and approve EmailTool to access your Google Workspace
          </List.Item>
        </List>
        <Stack spacing={20} mt={40}>
          <Anchor align="justify" onClick={() => closeModal(MODAL_IDS.GOOGLE_SELECT_CONNECTION_MODAL)}>
            <Group spacing={15} display="inline-flex">
              <IconArrowLeft size={18} />
              <Text inline>Back to Connection settings</Text>
            </Group>
          </Anchor>
          <Button color="red" component="a" href="/api/oauth2" leftIcon={<IconBrandGoogle size={18} />}>
            Login to Google Workspace
          </Button>
          <Button onClick={() => closeAllModals()} variant="light">
            Cancel
          </Button>
        </Stack>
      </>
    ),
  });
