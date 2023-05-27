import { closeAllModals, openConfirmModal } from '@mantine/modals';
import { Badge, Button, Divider, Group, Stack, Text, Title } from '@mantine/core';
import Image from 'next/image';
import React from 'react';

import GmailSVG from '@assets/svg/gmail.svg';
import OutlookSVG from '@assets/svg/outlook.svg';
import SmtpSVG from '@assets/svg/smtp.svg';

import { MODAL_IDS } from '../constants';

import { enableGoogleImapModal } from './enableGoogleImapModal';

export const getProvidersModal = () =>
  openConfirmModal({
    modalId: MODAL_IDS.SELECT_PROVIDER_MODAL,
    size: 400,
    padding: 36,
    closeOnConfirm: false,
    confirmProps: {
      hidden: true,
    },
    cancelProps: {
      hidden: true,
    },
    children: (
      <>
        <Title align="center" order={3}>
          Connect a new email account
        </Title>
        <Divider my="lg" size={1} variant="solid" color="gray.1" />
        <Stack spacing={20}>
          <Group
            onClick={() => enableGoogleImapModal()}
            py={15}
            px={30}
            sx={{
              transition: 'all 0.3s',
              '&:hover': {
                boxShadow: 'rgb(0 0 0 / 8%) 0px 2px 4px, rgb(0 0 0 / 10%) 0px 2px 12px;',
                cursor: 'pointer',
              },
            }}
            spacing={25}
          >
            <Image src={GmailSVG} width={40} height={40} alt="Gmail / G-Suite" />
            <Stack spacing={0}>
              <Text color="gray.5">Google</Text>
              <Title order={5}>Gmail / G-Suite</Title>
            </Stack>
          </Group>
          <Group py={15} px={30} spacing={25} sx={{ filter: 'grayscale(1)' }}>
            <Image src={OutlookSVG} width={40} height={40} alt="Office 365 / Outlook" />
            <Stack spacing={1}>
              <Group position="apart">
                <Text color="gray.5">Microsoft</Text>
                <Badge>Soon</Badge>
              </Group>

              <Title order={5}>Office 365 / Outlook</Title>
            </Stack>
          </Group>
          <Group py={15} px={30} spacing={25} sx={{ filter: 'grayscale(1)' }}>
            <Image src={SmtpSVG} width={40} height={40} alt="IMAP / SMTP" />
            <Stack spacing={1}>
              <Group position="apart">
                <Text color="gray.5">Any Provider</Text>
                <Badge>Soon</Badge>
              </Group>
              <Title order={5}>IMAP / SMTP</Title>
            </Stack>
          </Group>
          <Button mt={30} onClick={() => closeAllModals()} variant="light">
            Cancel
          </Button>
        </Stack>
      </>
    ),
  });
