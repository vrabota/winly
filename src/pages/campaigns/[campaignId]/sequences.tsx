import React, { useState } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { Grid, Stack, Button } from '@mantine/core';
import { useRouter } from 'next/router';

import { CampaignTabs } from '@features/campaigns';
import { SequenceTab, SequenceEditor } from '@features/sequences';
import { api } from '@utils/api';

import type { SequencesType } from '@server/api/campaigns/data/dtos';
import type { NextPage } from 'next';

const Sequences: NextPage = () => {
  const { query } = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [sequences, setSequences] = useState<SequencesType[]>([]);
  api.campaign.getCampaignById.useQuery(
    { campaignId: query.campaignId as string },
    {
      onSuccess: data => {
        if (!data?.sequences?.length || data?.sequences?.length === 0) {
          return setSequences(sequences => [...sequences, { subject: '', body: '' }]);
        }
        setSequences(data.sequences || []);
      },
    },
  );
  const updateSequence = ({ subject, body, delay }: { subject?: string; body?: string; delay?: string }) => {
    setSequences(sequences => {
      return sequences.map((sequence, i) => {
        if (activeIndex === i) {
          if (subject || subject === '') return { ...sequence, subject };
          if (body || body === '') return { ...sequence, body };
          if (delay) return { ...sequence, delay };
          return sequence;
        } else {
          return sequence;
        }
      });
    });
  };
  const addNewStep = () => {
    setSequences(sequences => [...sequences, { subject: '', body: '' }]);
    setActiveIndex(sequences.length);
  };
  const onStepClick = (index: number) => setActiveIndex(index);
  const deleteStep = (index: number) => {
    setSequences(sequences => {
      return sequences
        .filter((item, itemIndex) => itemIndex !== index)
        .concat(sequences.length === 1 ? [{ subject: '', body: '' }] : []);
    });
    setActiveIndex(index - 1 < 0 ? 0 : index - 1);
  };
  return (
    <>
      <CampaignTabs />
      <Grid gutter={40} my={20}>
        <Grid.Col span={3}>
          <Stack>
            {sequences.map((sequence, index) => (
              <SequenceTab
                deleteStep={() => deleteStep(index)}
                setActive={() => onStepClick(index)}
                index={index}
                isActive={index === activeIndex}
                isFirst={index === 0}
                updateSequence={updateSequence}
                key={`${sequence.subject}-${index}`}
                subject={sequence?.subject || ''}
                delay={sequences[activeIndex]?.delay || ''}
              />
            ))}
            <Button variant="outline" radius="md" onClick={addNewStep}>
              Add Step
            </Button>
          </Stack>
        </Grid.Col>
        <Grid.Col span="auto">
          <SequenceEditor
            activeIndex={activeIndex}
            updateSequence={updateSequence}
            subject={sequences[activeIndex]?.subject || ''}
            body={sequences[activeIndex]?.body || ''}
            sequences={sequences}
          />
        </Grid.Col>
      </Grid>
    </>
  );
};

export default withPageAuthRequired(Sequences);
