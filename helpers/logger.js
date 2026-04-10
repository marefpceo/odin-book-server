import pino from 'pino';

const transport = pino.transport({
  // target: 'pino/file',
  // options: { destination: './logs.log' },
  target: 'pino-roll',
  options: {
    file: './logs/log.log',
    frequency: 'weekly',
    size: '20MB',
    mkdir: true,
    symlink: true,
    limit: { count: 3 },
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
