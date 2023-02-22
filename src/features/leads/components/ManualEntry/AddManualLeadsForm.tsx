import React from 'react';
import { Button, Group, Stack } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';
import { z } from 'zod';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons';

import { TextArea } from '@components/form';
import { api } from '@utils/api';

const AddManualLeadsForm = () => {
  const validationSchema = z.object({
    leads: z.string().min(1, { message: 'Leads fields is Required' }),
  });
  type ValidationSchema = z.infer<typeof validationSchema>;
  const methods = useForm<ValidationSchema>({
    defaultValues: {
      leads: '',
    },
    resolver: zodResolver(validationSchema),
  });
  const { query } = useRouter();
  const utils = api.useContext();
  const { mutate, isLoading } = api.leads.batchCreateLeads.useMutation({
    onSuccess: async data => {
      showNotification({
        color: 'teal',
        title: 'Leads added.',
        message: `We added ${data.count} for your campaign.`,
        autoClose: 2000,
        icon: <IconCheck size={16} />,
      });
      closeAllModals();
      await utils.leads.invalidate();
    },
  });
  const onSubmit = async (data: ValidationSchema) => {
    if (typeof query?.campaignId === 'string') {
      const leads = data.leads.split('\n');
      const leadsMapping = leads.map(lead => {
        const leadWithName = lead.split(' ');
        if (leadWithName.length > 1) {
          const leadEmail = leadWithName[leadWithName.length - 1];
          return {
            campaignId: query.campaignId as string,
            firstName: leadWithName[0],
            lastName: leadWithName[1],
            email: leadEmail?.replace('<', '').replace('>', '') || '',
          };
        }
        return {
          campaignId: query.campaignId as string,
          email: lead,
        };
      });
      await mutate(leadsMapping);
    }
  };
  return (
    <FormProvider {...methods}>
      <Stack>
        <TextArea
          placeholder="Add your emails here"
          label="Type or paste email addresses (one email per line)"
          name="leads"
          minRows={6}
        />
      </Stack>
      <Group position="right" mt={40}>
        <Button onClick={() => closeAllModals()} variant="light">
          Cancel
        </Button>
        <Button loading={isLoading} onClick={methods.handleSubmit(onSubmit)}>
          Add Leads
        </Button>
      </Group>
    </FormProvider>
  );
};

export default AddManualLeadsForm;
