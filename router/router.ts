import express from 'express'
import tuyaController from '../tuya.controller'

const router = express.Router();

router.get('/action/:device/:action', async (
    req,
    res) => {
    await tuyaController.action(req.params.device, req.params.action);
    res.json(tuyaController.status(req.params.device));
});

router.get('/status/:device', (
    req,
    res) => {
    res.json(tuyaController.status(req.params.device));
});

export default router;
