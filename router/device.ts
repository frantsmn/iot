import express from 'express'
import {tuyaDeviceController} from "../controller";

const device = express.Router();

device.get('/action/:device/:action', async (
    req,
    res) => {
    await tuyaDeviceController.action(req.params.device, req.params.action, req.body);
    res.json(await tuyaDeviceController.status(req.params.device));
});

device.post('/action/:device/dps', async (
    req,
    res) => {
    await tuyaDeviceController.action(req.params.device, 'dps', req.body);
    res.json(await tuyaDeviceController.status(req.params.device));
});

device.post('/action/:device/rgb', async (
    req,
    res) => {
    await tuyaDeviceController.action(req.params.device, 'rgb', req.body);
    res.json(await tuyaDeviceController.status(req.params.device));
});

device.get('/status/:device', async (
    req,
    res) => {
    res.json(await tuyaDeviceController.status(req.params.device));
});

export default device;
