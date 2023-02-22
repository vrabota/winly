import { closeAllModals, closeModal, openConfirmModal } from '@mantine/modals';
import { Anchor, Button, Divider, Group, List, Mark, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import Image from 'next/image';
import React from 'react';
import { IconArrowLeft } from '@tabler/icons';

import GmailSVG from '@assets/svg/gmail.svg';

import { MODAL_IDS } from '../constants';

import { appPasswordFormModal } from './appPasswordFormModal';

export const appPasswordInfoModal = () =>
  openConfirmModal({
    modalId: MODAL_IDS.GOOGLE_APP_PASSWORD_INFO_MODAL,
    size: 500,
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
            closeModal(MODAL_IDS.GOOGLE_APP_PASSWORD_INFO_MODAL);
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
          Enable 2-step verification & generate <Mark color="yellow.0">App password</Mark>
        </Text>
        <Divider my="xl" size={1} variant="solid" color="gray.1" />
        <List center spacing="lg" size="md">
          <List.Item icon={<ThemeIcon radius="xl">1</ThemeIcon>}>
            Go to your Google Account&apos;s{' '}
            <Anchor href="https://myaccount.google.com/security" target="_blank">
              Security Settings
            </Anchor>
            .
          </List.Item>
          <List.Item icon={<ThemeIcon radius="xl">2</ThemeIcon>}>
            Enable{' '}
            <Anchor href="https://myaccount.google.com/signinoptions/two-step-verification" target="_blank">
              2-step verification
            </Anchor>
          </List.Item>
          <List.Item icon={<ThemeIcon radius="xl">3</ThemeIcon>}>
            Create an{' '}
            <Anchor href="https://myaccount.google.com/apppasswords" target="_blank">
              App password
            </Anchor>{' '}
            <br />
            Select{' '}
            <Text span weight="bolder">
              Other
            </Text>{' '}
            for both App and Device
          </List.Item>
        </List>
        <Stack spacing={20} mt={40}>
          <Anchor align="justify" onClick={() => closeModal(MODAL_IDS.GOOGLE_APP_PASSWORD_INFO_MODAL)}>
            <Group spacing={15} display="inline-flex">
              <IconArrowLeft size={18} />
              <Text inline>Back to Connection settings</Text>
            </Group>
          </Anchor>
          <Button onClick={() => appPasswordFormModal()}>Next</Button>
          <Button onClick={() => closeAllModals()} variant="light">
            Cancel
          </Button>
        </Stack>
      </>
    ),
  });
