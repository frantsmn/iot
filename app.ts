import express from 'express'
import auth from './auth'
import router from './router'
import error from './error'

const app = express();
const port = 3001;

app.listen(port, () => console.log(`IoT service started on port ${port}`));

app.use(auth);
app.use(router);
app.use(error);
