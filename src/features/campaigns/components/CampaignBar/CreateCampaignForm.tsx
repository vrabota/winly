import React from 'react';
import { Button, Group, Stack } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';
import { z } from 'zod';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons';

import { TextInput } from '@components/form';
import { api } from '@utils/api';

const CreateCampaignForm = () => {
  const validationSchema = z.object({
    name: z.string().min(1, { message: 'Campaign name is Required' }),
  });
  type ValidationSchema = z.infer<typeof validationSchema>;
  const methods = useForm<ValidationSchema>({
    defaultValues: {
      name: '',
    },
    resolver: zodResolver(validationSchema),
  });
  const utils = api.useContext();
  const { mutate, isLoading } = api.campaign.createCampaign.useMutation({
    onSuccess: async data => {
      await utils.campaign.getAllCampaigns.invalidate();
      closeAllModals();
      showNotification({
        color: 'teal',
        title: 'Campaign created',
        message: `We created ${data.name} campaign in Draft state.`,
        autoClose: 2000,
        icon: <IconCheck size={16} />,
      });
    },
  });
  const onSubmit = async (data: ValidationSchema) => {
    await mutate({ name: data.name });
  };
  return (
    <FormProvider {...methods}>
      <Stack>
        <TextInput label="Name" name="name" />
      </Stack>
      <Group position="right" mt={10}>
        <Button onClick={() => closeAllModals()} variant="light">
          Cancel
        </Button>
        <Button loading={isLoading} onClick={methods.handleSubmit(onSubmit)}>
          Create
        </Button>
      </Group>
    </FormProvider>
  );
};

export default CreateCampaignForm;
