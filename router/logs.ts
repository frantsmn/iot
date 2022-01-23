import express from 'express'
import {hub} from '../logger/'

const router = express.Router();

router.get('/logs', async (
    req,
    res) => {
    res.json(hub.history);
});

export default router;
