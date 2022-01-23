import express from 'express'
import auth from './router/auth'
import router from './router/router'
import logs from './router/logs'
import error from './router/error'

import {log, appLogger} from './logger/app-logger'

// Действия по расписаниям
import './scheduler'

const app = express();
const port = 3001;
log.error({
    test: 1,
    message: 'error',

})
app.listen(port, () => log.info(`IoT started on port ${port}`));
app.use(appLogger);
app.use(express.json());
app.use(auth);
app.use(router);
app.use(logs);
app.use(error);
