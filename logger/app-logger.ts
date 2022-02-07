import loggerCreator from '../logger'

const log = loggerCreator('app');

const appLogger = (req, res, next) => {
    log.info(`[${req.method}] > ${req.path}`);
    next();
}

export {log, appLogger};
