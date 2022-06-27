import express from 'express'
import auth from './router/auth'
import error from './router/error'
import device from './router/device'
import restart from './router/restart'
import logs from './router/logs'

import {log, appLogger} from './logger/app-logger'

// Действия по расписаниям (поиск устройства пользователя)
import './scheduler'
// Конфигурация умного дома
import './config'

import './websocket/server';

const app = express();
const port = 3001;
app.listen(port, () => log.info(`iot started on port ${port}`));
app.use(appLogger);
app.use(express.json());
app.use(auth);
app.use(device);
app.use(restart);
app.use(logs);
app.use(error);
