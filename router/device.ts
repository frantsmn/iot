import {Router} from 'express';
import tuyaDevicesController from '../modules/tuya/index';

const device = Router();

device.all('/action/:device/:action', async (
    req,
    res,
) => {
    await tuyaDevicesController.action(req.params.device, req.params.action, req.body);
    res.json(await tuyaDevicesController.status(req.params.device));
});

device.all('/action/:device/dps', async (
    req,
    res,
) => {
    await tuyaDevicesController.action(req.params.device, 'dps', req.body);
    res.json(await tuyaDevicesController.status(req.params.device));
});

device.all('/action/:device/rgb', async (
    req,
    res,
) => {
    await tuyaDevicesController.action(req.params.device, 'rgb', req.body);
    res.json(await tuyaDevicesController.status(req.params.device));
});

device.all('/status/:device', async (
    req,
    res,
) => {
    res.json(await tuyaDevicesController.status(req.params.device));
});

export default device;
