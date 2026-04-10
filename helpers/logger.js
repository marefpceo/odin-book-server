import pino from 'pino';

const transport = pino.transport({
  target: 'pino-roll',
  options: {
    file: './logs/log.log',
    frequency: 'daily',
    size: 20,
    mkdir: true,
    symlink: true,
    limit: { count: 6 },
  },
  level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
});
const logger = pino(
  {
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level(label) {
        return { level: label };
      },
    },
  },
  transport,
);

export default logger;
