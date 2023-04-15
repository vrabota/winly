import { AccountState } from '@prisma/client';

export const ACCOUNT_STATUS_MAPPING: Record<AccountState, { text: string; color: string }> = {
  [AccountState.CONNECTED]: {
    text: 'Connected',
    color: 'green',
  },
  [AccountState.ERROR]: {
    text: 'Error',
    color: 'red',
  },
  [AccountState.CONNECTING]: {
    text: 'Connecting',
    color: 'blue',
  },
  [AccountState.DISCONNECTED]: {
    text: 'Disconnected',
    color: 'red',
  },
};
