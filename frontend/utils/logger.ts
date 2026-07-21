import pino from 'pino';

const fileTransport = pino.transport({
    target: 'pino/file',
    options: { destination: './app.log' },
});

export const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    formatters: {
        level: (label) => ({ level: label.toUpperCase() }),
    },
    timestamp: pino.stdTimeFunctions.isoTime,
}, fileTransport);