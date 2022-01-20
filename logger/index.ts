import {createLogger, format, transports} from 'winston';

const {combine, timestamp, label, printf, errors, colorize} = format;

const timeFormat = timestamp({format: 'DD.MM.YY HH:mm:ss'});
const logFormat = printf(({level, message, label, timestamp}) =>
    `${timestamp} [${label}] ${level}: ${message}`
);

function createConsoleFormat(loggerName) {
    return combine(
        colorize(),
        label({label: loggerName}),
        errors({stack: true}),
        timeFormat,
        logFormat,
    );
}

export default (loggerName) => createLogger({
    transports: [new transports.Console({
        level: 'silly',
        format: createConsoleFormat(loggerName)
    })]
});
