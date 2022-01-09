import express from 'express'
import {tuyaDeviceController} from "../controller";

const router = express.Router();

router.get('/action/:device/:action', async (
    req,
    res) => {
    await tuyaDeviceController.action(req.params.device, req.params.action);
    res.json(tuyaDeviceController.status(req.params.device));
});

router.get('/status/:device', (
    req,
    res) => {
    res.json(tuyaDeviceController.status(req.params.device));
});

export default router;
