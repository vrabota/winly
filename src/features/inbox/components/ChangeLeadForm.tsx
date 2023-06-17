import React from 'react';
import { Button, Group, Stack } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';
import { z } from 'zod';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons';
import { LeadStatus } from '@prisma/client';
import capitalize from 'lodash/capitalize';

import { SelectField } from '@components/form';
import { api } from '@utils/api';

const leadOptions = Object.keys(LeadStatus).map(status => ({
  value: status,
  label: capitalize(status.replaceAll('_', ' ')),
}));

const ChangeLeadForm = ({ status, leadId, email }: { status: LeadStatus; leadId: string; email?: string }) => {
  const validationSchema = z.object({
    status: z.nativeEnum(LeadStatus),
  });
  type ValidationSchema = z.infer<typeof validationSchema>;
  const methods = useForm<ValidationSchema>({
    defaultValues: {
      status,
    },
    resolver: zodResolver(validationSchema),
  });
  const utils = api.useContext();
  const { mutate, isLoading } = api.leads.updateLead.useMutation({
    onSuccess: async data => {
      await utils.activity.getRepliedThread.invalidate();
      closeAllModals();
      showNotification({
        color: 'teal',
        title: 'Lead status updated',
        message: `We updated lead status to ${capitalize(data.status.replaceAll('_', ' '))}.`,
        autoClose: 2000,
        icon: <IconCheck size={16} />,
      });
    },
  });
  const onSubmit = async (data: ValidationSchema) => {
    if (email) {
      await mutate({ leadId, email, status: data.status });
    }
  };
  return (
    <FormProvider {...methods}>
      <Stack>
        <SelectField name="status" label="Select lead status" data={leadOptions} />
      </Stack>
      <Group position="right" mt={10}>
        <Button onClick={() => closeAllModals()} variant="light">
          Cancel
        </Button>
        <Button loading={isLoading} onClick={methods.handleSubmit(onSubmit)}>
          Change
        </Button>
      </Group>
    </FormProvider>
  );
};

export default ChangeLeadForm;
