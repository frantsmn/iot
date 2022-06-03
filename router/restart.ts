import express from 'express'
import pm2 from 'pm2'

const router = express.Router();

router.get('/restart', async (
    req,
    res) => {
    res.json('ok');
    pm2.restart('iot', () => {});
});

export default router;
