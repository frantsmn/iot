import {createLogger, format, transports} from 'winston';
import TelegramBotTransport from './transport/TelegramBotTransport';
// import logHub from '../logHub';
// import LogHubTransport from './transport/LogHubTransport';

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

// function createLogHubFormat(loggerName) {
//     return combine(
//         label({label: loggerName}),
//         timestamp(),
//     );
// }

const loggerCreator = (loggerName) => createLogger({
    transports: [
        new transports.Console({
            level: 'silly',
            format: createConsoleFormat(loggerName),
        }),
        new TelegramBotTransport({
            format: format.json(),
            level: 'silly',
            label: loggerName,
        }),
        // new LogHubTransport({
        //     level: 'silly',
        //     format: createLogHubFormat(loggerName),
        //     hub: logHub,
        // }),
    ],
});

export default loggerCreator;
