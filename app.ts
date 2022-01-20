import express from 'express'
import auth from './router/auth'
import router from './router/router'
import error from './router/error'
import loggerCreator from './logger'

// Действия по расписаниям
import './scheduler'

const log = loggerCreator('app');
const app = express();
const port = 3001;
app.listen(port, () => log.info(`IoT started on port ${port}`));
app.use(express.json());
app.use(auth);
app.use(router);
app.use(error);
