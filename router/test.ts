import express from 'express'
import pm2 from 'pm2'

const router = express.Router();

router.get('/throw-error', async (
    req,
    res) => {
    res.json('ok');
    throw '[test] throw-error';
});

router.get('/reboot', async (
    req,
    res) => {
    res.json('ok');
    pm2.restart('iot', () => {
        console.log('rebooted via user request');
    });
});

export default router;
