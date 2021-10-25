import express from 'express'
import tuyaController from './tuya.controller'

const router = express.Router();

router.get('/health', function (req, res) {
    res.json({status: 'ok'});
});

router.get('/action/:device/:action', async function (req, res) {
    await tuyaController.action(req.params.device, req.params.action);
    res.json(tuyaController.status(req.params.device));
});

router.get('/status/:device', function (req, res) {
    res.json(tuyaController.status(req.params.device));
});

export default router;
