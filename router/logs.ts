import {Router} from 'express';
import logHub from '../modules/logHub';

const router = Router();

router.get('/logs', async (
    req,
    res,
) => res.json(logHub.history));

export default router;
