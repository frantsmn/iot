import {Router} from 'express';
import {hub} from '../modules/logger';

const router = Router();

router.get('/logs', async (
    req,
    res,
) => res.json(hub.history));

export default router;
