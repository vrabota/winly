import { closeAllModals, closeModal, openConfirmModal } from '@mantine/modals';
import { Anchor, Button, Divider, Group, List, Mark, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import Image from 'next/image';
import React from 'react';
import { IconArrowLeft, IconSettings } from '@tabler/icons';

import GmailSVG from '@assets/svg/gmail.svg';

import { MODAL_IDS } from '../constants';

import { selectConnectionModal } from './selectConnectionModal';

export const enableGoogleImapModal = () =>
  openConfirmModal({
    modalId: MODAL_IDS.ENABLE_GOOGLE_IMAP_MODAL,
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
        <Anchor align="justify" onClick={() => closeModal(MODAL_IDS.ENABLE_GOOGLE_IMAP_MODAL)}>
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
          First, let&apos;s <Mark color="yellow.0">Enable IMAP</Mark> access <br />
          for your Google account.
        </Text>
        <Divider my="xl" size={1} variant="solid" color="gray.1" />
        <List center spacing="lg" size="md">
          <List.Item icon={<ThemeIcon radius="xl">1</ThemeIcon>}>On your computer, open Gmail.</List.Item>
          <List.Item icon={<ThemeIcon radius="xl">2</ThemeIcon>}>
            Click the <IconSettings size={16} style={{ margin: '0 5px' }} /> icon in the top right corner.
          </List.Item>
          <List.Item icon={<ThemeIcon radius="xl">3</ThemeIcon>}>
            Click{' '}
            <Text span weight="bolder">
              All Settings
            </Text>
            .
          </List.Item>
          <List.Item icon={<ThemeIcon radius="xl">4</ThemeIcon>}>
            Click the{' '}
            <Anchor href="https://mail.google.com/mail/u/0/#settings/fwdandpop">Forwarding and POP/IMAP</Anchor> tab.
          </List.Item>
          <List.Item icon={<ThemeIcon radius="xl">5</ThemeIcon>}>
            In the <Mark color="yellow.0">IMAP access</Mark> section, select{' '}
            <Text span weight="bolder">
              Enable IMAP
            </Text>
            .
          </List.Item>
          <List.Item icon={<ThemeIcon radius="xl">6</ThemeIcon>}>
            Click{' '}
            <Text span weight="bolder">
              Save Changes
            </Text>
            .
          </List.Item>
        </List>
        <Stack spacing={20} mt={40}>
          <Button onClick={() => selectConnectionModal()}>Yes, IMAP has been enabled</Button>
          <Button onClick={() => closeAllModals()} variant="light">
            Cancel
          </Button>
        </Stack>
      </>
    ),
  });
