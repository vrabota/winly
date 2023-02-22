import React from 'react';
import { z } from 'zod';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Anchor, Button, Divider, Group, Stack, Text, Title } from '@mantine/core';
import { closeAllModals, closeModal } from '@mantine/modals';
import { IconArrowLeft, IconCheck } from '@tabler/icons';
import Image from 'next/image';
import { showNotification, updateNotification } from '@mantine/notifications';

import { MODAL_IDS } from '@features/accounts/components/ConnectAccount/constants';
import GmailSVG from '@assets/svg/gmail.svg';
import { PasswordInput, TextInput } from '@components/form';
import { api } from '@utils/api';

const CONNECT_APP_PASSWORD_ACCOUNT = 'CONNECT_APP_PASSWORD_ACCOUNT';

const AppPasswordForm = () => {
  const validationSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email().min(1, { message: 'Required' }),
    appPassword: z.string().min(1, { message: 'Required' }),
  });
  type ValidationSchema = z.infer<typeof validationSchema>;
  const methods = useForm<ValidationSchema>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      appPassword: '',
    },
    resolver: zodResolver(validationSchema),
  });
  const utils = api.useContext();
  const { mutate, isLoading } = api.account.connectAppPasswordAccount.useMutation({
    onSuccess: async () => {
      await utils.account.getAccounts.invalidate();
      closeAllModals();
      updateNotification({
        id: CONNECT_APP_PASSWORD_ACCOUNT,
        color: 'teal',
        title: 'Account connected',
        message: 'Your account is connected to our system',
        autoClose: 2000,
        icon: <IconCheck size={16} />,
      });
    },
  });
  const onSubmit = (data: ValidationSchema) => {
    mutate(data);
    showNotification({
      id: CONNECT_APP_PASSWORD_ACCOUNT,
      loading: true,
      title: 'Connecting account...',
      message: 'We are connecting you account to our system',
      disallowClose: true,
      autoClose: false,
    });
  };
  return (
    <>
      <Anchor
        align="justify"
        onClick={() => {
          closeModal(MODAL_IDS.GOOGLE_APP_PASSWORD_FORM_MODAL);
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
      <Divider my="xl" size={1} variant="solid" color="gray.1" />
      <FormProvider {...methods}>
        <Stack>
          <Group position="apart" grow>
            <TextInput label="First Name" name="firstName" />
            <TextInput label="Last Name" name="lastName" />
          </Group>
          <TextInput type="email" label="Email" name="email" description="Email address to connect" withAsterisk />
          <PasswordInput
            label="App Password"
            name="appPassword"
            description="Enter your 16 character app password"
            withAsterisk
          />
        </Stack>
      </FormProvider>
      <Stack spacing={20} mt={40}>
        <Anchor align="justify" onClick={() => closeModal(MODAL_IDS.GOOGLE_APP_PASSWORD_FORM_MODAL)}>
          <Group spacing={15} display="inline-flex">
            <IconArrowLeft size={18} />
            <Text inline>Back to Setup Information</Text>
          </Group>
        </Anchor>
        <Button loading={isLoading} onClick={methods.handleSubmit(onSubmit)}>
          Connect
        </Button>
        <Button onClick={() => closeAllModals()} variant="light">
          Cancel
        </Button>
      </Stack>
    </>
  );
};

export default AppPasswordForm;
