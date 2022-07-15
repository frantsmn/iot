import express from 'express';
import logger from './router/logger';
import auth from './router/auth';
import device from './router/device';
import actions from './router/actions';
// import restart from './router/restart';
// import logs from './router/logs';
import error from './router/error';

const app = express();
const port = 3001;

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`iot started on port ${port}`));
app.use(express.json());
app.use(logger);
app.use(auth);
app.use(device);
app.use(actions);
// app.use(restart);
// app.use(logs);
app.use(error);
