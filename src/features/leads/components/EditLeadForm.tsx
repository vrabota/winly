import React from 'react';
import { Button, Group, Stack, SimpleGrid, LoadingOverlay, Text, Divider } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';
import { z } from 'zod';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons';
import { LeadStatus } from '@prisma/client';
import { useRouter } from 'next/router';

import { TextInput } from '@components/form';
import { api } from '@utils/api';

const EditLeadForm = ({ leadId }: { leadId: string }) => {
  const { data, isLoading } = api.leads.getLead.useQuery({ leadId });
  const { query } = useRouter();
  const validationSchema = z.object({
    email: z.string().min(1),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    companyName: z.string().optional(),
    phone: z.string().optional(),
    website: z.string().optional(),
    customVariables: z.array(z.any()).optional(),
    status: z.nativeEnum(LeadStatus).optional(),
  });
  type ValidationSchema = z.infer<typeof validationSchema>;
  const methods = useForm<ValidationSchema>({
    values: {
      email: data?.email || '',
      firstName: data?.firstName || '',
      lastName: data?.lastName || '',
      companyName: data?.companyName || '',
      phone: data?.phone || '',
      website: data?.website || '',
      status: data?.status,
      customVariables: (data?.customVariables as any) || [],
    },
    resolver: zodResolver(validationSchema),
  });
  const { fields } = useFieldArray({
    control: methods.control,
    name: 'customVariables',
  });
  const utils = api.useContext();
  const { mutate, isLoading: isUpdateLoading } = api.leads.updateLead.useMutation({
    onSuccess: async data => {
      await utils.leads.getLeads.invalidate();
      closeAllModals();
      showNotification({
        color: 'teal',
        title: 'Lead updated',
        message: `Lead ${data.email} updated.`,
        autoClose: 2000,
        icon: <IconCheck size={16} />,
      });
    },
  });
  const onSubmit = async (data: ValidationSchema) => {
    mutate({ ...data, leadId, campaignId: query.campaignId as string });
  };
  const customVariables = methods.getValues().customVariables || [];
  return (
    <FormProvider {...methods}>
      <LoadingOverlay visible={isLoading} overlayBlur={2} />
      <Stack>
        <SimpleGrid cols={2}>
          <TextInput label="Email" name="email" />
          <TextInput label="First Name" name="firstName" />
          <TextInput label="Last Name" name="lastName" />
          <TextInput label="Company" name="companyName" />
          <TextInput label="Phone" name="phone" />
          <TextInput label="Website" name="website" />
        </SimpleGrid>
        {customVariables.length > 0 && (
          <>
            <Divider mt={20} mb={10} color="gray.2" />
            <Text>Custom Variables:</Text>
            <SimpleGrid cols={2}>
              {fields.map((field, index) => (
                <TextInput
                  key={field.id}
                  label={Object.keys(field)[0]}
                  name={`customVariables.${index}.${Object.keys(field)[0]}`}
                />
              ))}
            </SimpleGrid>
          </>
        )}
      </Stack>
      <Group position="right" mt={10}>
        <Button onClick={() => closeAllModals()} variant="light">
          Cancel
        </Button>
        <Button loading={isUpdateLoading} onClick={methods.handleSubmit(onSubmit)}>
          Edit
        </Button>
      </Group>
    </FormProvider>
  );
};

export default EditLeadForm;
