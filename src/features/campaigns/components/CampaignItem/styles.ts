import { createStyles } from '@mantine/core';

export const useStyles = createStyles(() => ({
  campaign: {
    transition: 'all 0.3s',
    '&:hover': { boxShadow: 'rgb(0 0 0 / 8%) 0px 2px 4px, rgb(0 0 0 / 10%) 0px 2px 12px;' },
  },
}));
