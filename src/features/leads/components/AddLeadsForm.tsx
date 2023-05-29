import React, { useRef, useState } from 'react';
import { Button, Group, Stack, Radio, Text, ActionIcon, useMantineTheme, Table, Select, Alert } from '@mantine/core';
import { z } from 'zod';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { showNotification } from '@mantine/notifications';
import { IconBulb, IconCheck, IconX, IconAlertTriangle } from '@tabler/icons';
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

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const [parseData, setParseData] = useState<any>();
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [missingEmails, setMissingEmails] = useState(false);
  const [fields, setFields] = useState<any>({});
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
    onError: () => {
      showNotification({
        color: 'red',
        title: 'Ooops something went wrong.',
        message: `Can't create leads.`,
        autoClose: 4000,
        icon: <IconX size={16} />,
      });
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
        const data = parseData?.data.map((item: any) => ({
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
          console.log(results);
          const { data, meta } = results;
          const emailColumnName = meta?.fields?.find(columnName => columnName.toLowerCase() === 'email');

          if (!emailColumnName) {
            showNotification({
              color: 'red',
              title: 'Ooops something went wrong.',
              message: `You must have a email column in CSV file`,
              autoClose: 4000,
              icon: <IconX size={16} />,
            });
            setLoadingFiles(false);
            setFiles([]);
            return;
          }

          const filteredData = data.filter((item: any) => {
            return item[emailColumnName] && emailPattern.test(item[emailColumnName]);
          });

          if (filteredData.length !== data.length) {
            setMissingEmails(true);
          }

          setLoadingFiles(false);
          setParseData({ ...results, data: filteredData });
          const fields: string[] = meta.fields || [];
          const fieldsMapping = fields.reduce((accumulator, value) => {
            return { ...accumulator, [value]: getFieldDefaultValue(value) };
          }, {});
          setFields(fieldsMapping);
        },
        skipEmptyLines: true,
      });
    }
    setFiles(files);
  };
  const onRemoveFile = (e: MouseEvent) => {
    e.stopPropagation();
    setFiles([]);
    setMissingEmails(false);
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
          {missingEmails && (
            <Alert
              my={20}
              color="yellow"
              icon={<IconAlertTriangle size={16} />}
              title="We found rows that doesn't have an email"
            >
              We filtered all rows that don`t have a valid email address. <br />
              Please fix CSV file if you want to have this rows uploaded.
            </Alert>
          )}

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
                {parseData?.meta?.fields?.map((field: any, index: number) => (
                  <tr key={`${field}-${index}`}>
                    <td>{field}</td>
                    <td>
                      <Select
                        w="200px"
                        size="sm"
                        placeholder="Pick one"
                        defaultValue={getFieldDefaultValue(field)}
                        data={FIELDS_SELECT_OPTIONS}
                        onChange={value => setFields((prevState: any) => ({ ...prevState, [field]: value }))}
                        styles={theme => ({
                          input: {
                            color: fields[field] == 'noImport' ? theme.colors.gray[4] : theme.colors.purple?.[8],
                          },
                        })}
                      />
                    </td>
                    <td width="40%">
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
