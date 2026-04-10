import pino from 'pino';

const transport = pino.transport({
  target: 'pino/file',
  options: { destination: './logs.log' },
  level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
});
const logger = pino(
  {
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level(label, number) {
        return { level: label };
      },
    },
  },
  transport,
);

export default logger;
