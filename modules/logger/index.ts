import {createLogger, format, transports} from 'winston';
import RuntimeTransport from './transport/RuntimeTransport';
import LogHub from './transport/LogHub';

const {
    combine,
    timestamp,
    label,
    printf,
    errors,
    colorize,
} = format;
const timeFormat = timestamp({format: 'DD.MM.YY HH:mm:ss'});
const logFormat = printf(({
    level,
    message,
    label,
    timestamp,
}) => `${timestamp} [${label}] ${level}: ${message}`);

function createConsoleFormat(loggerName) {
    return combine(
        colorize(),
        label({label: loggerName}),
        errors({stack: true}),
        timeFormat,
        logFormat,
    );
}

function createRuntimeFormat(loggerName) {
    return combine(
        label({label: loggerName}),
        timestamp(),
    );
}

export const hub = new LogHub({length: 100});
export default (loggerName) => createLogger({
    transports: [
        new transports.Console({
            level: 'silly',
            format: createConsoleFormat(loggerName),
        }),
        new RuntimeTransport({
            level: 'silly',
            format: createRuntimeFormat(loggerName),
            hub,
        }),
    ],
});
