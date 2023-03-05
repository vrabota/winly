import { pino } from 'pino';

const transport = {
  transport: {
    target: 'pino-pretty',
    options: {
      translateTime: 'SYS:standard',
    },
  },
};

export const logger = pino(process.env.NODE_ENV === 'development' ? transport : {});
