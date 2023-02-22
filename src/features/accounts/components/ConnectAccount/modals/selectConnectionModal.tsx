import { closeAllModals, closeModal, openConfirmModal } from '@mantine/modals';
import { Anchor, Button, Divider, Group, List, Mark, Paper, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import Image from 'next/image';
import React from 'react';
import { IconArrowLeft, IconCheck, IconExclamationMark } from '@tabler/icons';

import GmailSVG from '@assets/svg/gmail.svg';

import { MODAL_IDS } from '../constants';

import { appPasswordInfoModal } from './appPasswordInfoModal';
import { oauthConnectionModal } from './oauthConnectionModal';

export const selectConnectionModal = () =>
  openConfirmModal({
    modalId: MODAL_IDS.GOOGLE_SELECT_CONNECTION_MODAL,
    size: 700,
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
          Please select a <Mark color="yellow.0">connection</Mark> option <br />
          for your Google account.
        </Text>
        <Divider my="xl" size={1} variant="solid" color="gray.1" />
        <Group position="apart" grow>
          <Paper
            p={25}
            shadow="sm"
            withBorder
            onClick={() => appPasswordInfoModal()}
            sx={theme => ({
              borderColor: theme.colors.gray[1],
              transition: 'all 0.3s',
              cursor: 'pointer',
              '&:hover': { background: theme.colors.blue[0], boxShadow: theme.shadows.lg },
            })}
          >
            <Title order={5} align="center">
              Option 1: App Password
            </Title>
            <List my={20} center spacing="lg" size="sm">
              <List.Item
                sx={{ lineHeight: '1.4em' }}
                icon={
                  <ThemeIcon color="teal" radius="xl">
                    <IconCheck size={16} />
                  </ThemeIcon>
                }
              >
                Available for GSuite and Gmail accounts
              </List.Item>
              <List.Item
                icon={
                  <ThemeIcon color="yellow.5" radius="xl">
                    <IconExclamationMark size={16} />
                  </ThemeIcon>
                }
              >
                Requires 2-factor authentication
              </List.Item>
              <List.Item
                icon={
                  <ThemeIcon color="yellow.5" radius="xl">
                    <IconExclamationMark size={16} />
                  </ThemeIcon>
                }
              >
                More prone to disconnects
              </List.Item>
            </List>
          </Paper>
          <Paper
            p={25}
            shadow="sm"
            withBorder
            onClick={() => oauthConnectionModal()}
            sx={theme => ({
              borderColor: theme.colors.gray[1],
              transition: 'all 0.3s',
              cursor: 'pointer',
              '&:hover': { background: theme.colors.blue[0], boxShadow: theme.shadows.lg },
            })}
          >
            <Title order={5} align="center">
              Option 2: OAuth2
            </Title>
            <List my={20} center spacing="lg" size="sm">
              <List.Item
                icon={
                  <ThemeIcon color="teal" radius="xl">
                    <IconCheck size={16} />
                  </ThemeIcon>
                }
              >
                Easier to setup
              </List.Item>
              <List.Item
                icon={
                  <ThemeIcon color="teal" radius="xl">
                    <IconCheck size={16} />
                  </ThemeIcon>
                }
              >
                More stable
              </List.Item>
              <List.Item
                sx={{ lineHeight: '1.4em' }}
                icon={
                  <ThemeIcon color="yellow.5" radius="xl">
                    <IconExclamationMark size={16} />
                  </ThemeIcon>
                }
              >
                Only for GSuite accounts <br /> (no personal Gmail Accounts)
              </List.Item>
            </List>
          </Paper>
        </Group>
        <Stack spacing={20} mt={40}>
          <Anchor align="justify" onClick={() => closeModal(MODAL_IDS.GOOGLE_SELECT_CONNECTION_MODAL)}>
            <Group spacing={15} display="inline-flex">
              <IconArrowLeft size={18} />
              <Text inline>Back to IMAP settings</Text>
            </Group>
          </Anchor>
          <Button onClick={() => closeAllModals()} variant="light">
            Cancel
          </Button>
        </Stack>
      </>
    ),
  });
