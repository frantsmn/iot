import express from 'express'
import router from './router'

const app = express();
const port = 3001;

app.listen(port, () => console.log(`IoT service started on port ${port}`));
app.use(router);
