import camelCase from 'lodash/camelCase';
import trim from 'lodash/trim';
import { ActivityStatus, LeadStatus } from '@prisma/client';
import React from 'react';

import { MailReply, MailSend, BookOpen, Cursor, SadFace, LinkBroken, CheckMark } from '@assets/icons';

import { FIELDS_SELECT_OPTIONS } from './constants';

import type { ReactNode } from 'react';

export const getFieldDefaultValue = (value: string): string => {
  const defaultFieldValue = FIELDS_SELECT_OPTIONS.find(item => item.value.includes(camelCase(trim(value))));
  return defaultFieldValue?.value || 'noImport';
};

export const LEAD_STATUS_MAPPING: Record<LeadStatus, { text: string; color: string }> = {
  [LeadStatus.LEAD]: {
    text: 'LEAD',
    color: 'blue',
  },
  [LeadStatus.INTERESTED]: {
    text: 'INTERESTED',
    color: 'green',
  },
  [LeadStatus.MEETING_BOOKED]: {
    text: 'MEETING BOOKED',
    color: 'green',
  },
  [LeadStatus.MEETING_COMPLETED]: {
    text: 'MEETING COMPLETED',
    color: 'green',
  },
  [LeadStatus.CLOSED]: {
    text: 'CLOSED',
    color: 'green',
  },
  [LeadStatus.OUT_OF_OFFICE]: {
    text: 'OUT OF OFFICE',
    color: 'yellow',
  },
  [LeadStatus.NOT_INTERESTED]: {
    text: 'NOT INTERESTED',
    color: 'red',
  },
  [LeadStatus.WRONG_PERSON]: {
    text: 'WRONG PERSON',
    color: 'red',
  },
};

export const ACTIVITY_STATUS_MAPPING: Record<ActivityStatus, { text: string; icon: ReactNode }> = {
  [ActivityStatus.REPLIED]: {
    text: 'REPLIED',
    icon: <MailReply size={14} />,
  },
  [ActivityStatus.CONTACTED]: {
    text: 'CONTACTED',
    icon: <MailSend size={14} />,
  },
  [ActivityStatus.QUEUED]: {
    text: 'QUEUED',
    icon: <MailSend size={14} />,
  },
  [ActivityStatus.OPENED]: {
    text: 'OPENED',
    icon: <BookOpen size={14} />,
  },
  [ActivityStatus.CLICKED]: {
    text: 'CLICKED',
    icon: <Cursor size={14} />,
  },
  [ActivityStatus.BOUNCED]: {
    text: 'BOUNCED',
    icon: <SadFace size={14} />,
  },
  [ActivityStatus.ERROR]: {
    text: 'ERROR',
    icon: <LinkBroken size={14} />,
  },
  [ActivityStatus.COMPLETED]: {
    text: 'COMPLETED',
    icon: <CheckMark size={14} />,
  },
};
