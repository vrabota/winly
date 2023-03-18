import React, { useRef, useState } from 'react';
import { Button, Group, Stack, Radio, Alert, Text, ActionIcon, useMantineTheme, Table, Select } from '@mantine/core';
import { z } from 'zod';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { showNotification } from '@mantine/notifications';
import { IconBulb, IconCheck } from '@tabler/icons';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { parse } from 'papaparse';
import take from 'lodash/take';

import { TextArea, RadioGroup } from '@components/form';
import { api } from '@utils/api';
import { Delete, Upload } from '@assets/icons';
import { renameObjectKeys } from '@utils/renameObjectKeys';
import { FIELDS_SELECT_OPTIONS } from '@features/leads/constants';
import { getFieldDefaultValue } from '@features/leads/utils';

import type { FileWithPath } from '@mantine/dropzone';
import type { MouseEvent } from 'react';
import type { ParseResult } from 'papaparse';

const AddLeadsForm = ({ onClose }: { onClose: () => void }) => {
  const validationSchema = z.object({
    leads: z.string(),
    type: z.string().min(1, { message: 'Please select import type' }),
  });
  type ValidationSchema = z.infer<typeof validationSchema>;
  const methods = useForm<ValidationSchema>({
    defaultValues: {
      type: '',
      leads: '',
    },
    resolver: zodResolver(validationSchema),
  });
  const typeValue = useWatch({ name: 'type', control: methods.control });
  const openRef = useRef<() => void>(null);
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [parseData, setParseData] = useState<ParseResult<unknown>>();
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [fields, setFields] = useState({});
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
      onClose();
      await utils.leads.invalidate();
    },
  });
  const onSubmit = async (data: ValidationSchema) => {
    if (typeof query?.campaignId === 'string') {
      if (typeValue === 'manual') {
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
      if (typeValue === 'csv') {
        const data = parseData?.data.map(item => ({
          ...renameObjectKeys(fields, item, 'noImport'),
          campaignId: query.campaignId as string,
        })) as any;
        await mutate(data);
      }
    }
  };
  const handleUpload = (files: FileWithPath[]) => {
    setLoadingFiles(true);
    if (files[0]) {
      parse(files[0], {
        header: true,
        complete: function (results) {
          setLoadingFiles(false);
          setParseData(results);
          const fields: string[] = results.meta.fields || [];
          const fieldsMapping = fields.reduce((accumulator, value) => {
            return { ...accumulator, [value]: getFieldDefaultValue(value) };
          }, {});
          setFields(fieldsMapping);
        },
      });
    }
    setFiles(files);
  };
  const onRemoveFile = (e: MouseEvent) => {
    e.stopPropagation();
    setFiles([]);
    setParseData(undefined);
  };
  const theme = useMantineTheme();

  return (
    <FormProvider {...methods}>
      <Stack mb={30}>
        <RadioGroup name="type">
          <Stack w="100%">
            <Radio value="manual" label="Enter emails manually" />
            <Radio value="csv" label="Upload CSV file" />
          </Stack>
        </RadioGroup>
      </Stack>
      {typeValue === 'manual' && (
        <>
          <Alert
            icon={<IconBulb size={16} />}
            title="You can use one of the following formats:"
            color="pruple"
            radius={10}
            mb={20}
            py={20}
          >
            {`John Doe <john@doe.com>`}
            <br />
            {`John Doe john@doe.com`}
          </Alert>
          <Stack>
            <TextArea
              placeholder="Add your emails here"
              description="You can add multiple emails (one per line)"
              label="Email addresses"
              name="leads"
              minRows={6}
            />
          </Stack>
        </>
      )}

      {typeValue === 'csv' && (
        <>
          <Dropzone loading={loadingFiles} py={40} openRef={openRef} accept={[MIME_TYPES.csv]} onDrop={handleUpload}>
            {files[0] && (
              <ActionIcon
                onClick={onRemoveFile}
                size="lg"
                radius="xl"
                sx={{
                  ':hover': { transition: 'all 0.3s', background: '#fff' },
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  pointerEvents: 'all',
                }}
              >
                <Delete color={theme.colors.dark[9]} size={14} />
              </ActionIcon>
            )}

            <Group position="center">
              {files.length === 0 && <Upload />}
              {files[0] && <Text>{files?.[0].name}</Text>}
              {files.length === 0 && <Text>Drag file here or click to select files</Text>}
            </Group>
          </Dropzone>
          {parseData?.meta?.fields && (
            <Table
              mt={20}
              verticalSpacing="md"
              fontSize="sm"
              sx={theme => ({
                'thead tr th': {
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontSize: 10,
                  color: theme.colors.gray[5],
                },
              })}
            >
              <thead>
                <tr>
                  <th>Column name</th>
                  <th>Field type</th>
                  <th>Samples</th>
                </tr>
              </thead>
              <tbody>
                {parseData?.meta?.fields?.map((field, index) => (
                  <tr key={`${field}-${index}`}>
                    <td>{field}</td>
                    <td>
                      <Select
                        w="200px"
                        size="sm"
                        placeholder="Pick one"
                        defaultValue={getFieldDefaultValue(field)}
                        data={FIELDS_SELECT_OPTIONS}
                        onChange={value => setFields(prevState => ({ ...prevState, [field]: value }))}
                      />
                    </td>
                    <td>
                      {take((parseData?.data as []) || [], 3).map((item, indexSamples) => (
                        <Text key={`samples-${field}-${indexSamples}`}>{item[field]}</Text>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </>
      )}

      <Group position="right" mt={40}>
        <Button onClick={onClose} variant="light">
          Cancel
        </Button>
        <Button loading={isLoading} onClick={methods.handleSubmit(onSubmit)}>
          Import
        </Button>
      </Group>
    </FormProvider>
  );
};

export default AddLeadsForm;
