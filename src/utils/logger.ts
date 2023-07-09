import { pino } from 'pino';

export const logger = pino({
  formatters: {
    level(label) {
      return { level: label.toUpperCase() };
    },
    bindings() {
      return {};
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});
