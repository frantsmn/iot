import express from 'express'
import auth from './router/auth'
import device from './router/device'
import logs from './router/logs'
import error from './router/error'

import {log, appLogger} from './logger/app-logger'

// Действия по расписаниям (поиск устройства пользователя)
import './scheduler'
// Конфигурация умного дома
import './config'

const app = express();
const port = 3001;
app.listen(port, () => log.info(`IoT started on port ${port}`));
app.use(appLogger);
app.use(express.json());
app.use(auth);
app.use(device);
app.use(logs);
app.use(error);
