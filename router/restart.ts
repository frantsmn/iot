import pm2 from 'pm2';
import express from 'express';

const router = express.Router();

router.get('/restart', async (
    req,
    res,
) => {
    res.json('ok');
    pm2.restart('iot', () => {
    });
});

export default router;
