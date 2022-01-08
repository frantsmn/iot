import express from 'express'
import auth from './router/auth'
import router from './router/router'
import error from './router/error'

import Scheduler from './scheduler';
import './user-device-scan';

const app = express();
const port = 3001;

app.listen(port, () => console.log(`IoT service started on port ${port}`));

app.use(auth);
app.use(router);
app.use(error);

new Scheduler();
