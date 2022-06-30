import loggerCreator from '../modules/logger/index';

const log = loggerCreator('app');

export default (req, res, next) => {
    log.info(`[${req.method}] > ${req.path}`);
    next();
};
