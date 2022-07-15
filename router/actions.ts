import { Router } from 'express';
import tuyaDevicesController from '../modules/tuya/index';
import userDevicesController from '../modules/userDevice/index'

const actions = Router();

actions.all('/action/arrive', async (
    req,
    res,
) => {
    // todo (прикрутить API восходов-закатов)
    const date = new Date();
    const hours = date.getHours();

    if (hours >= 17 || hours <= 4) {
        await tuyaDevicesController.action('all', 'on');
    }

    res.json(await tuyaDevicesController.status('all'));
    userDevicesController.setState(req.body.name, true);
});

actions.all('/action/leave', async (
    req,
    res,
) => {
    await tuyaDevicesController.action('all', 'off');
    res.json(await tuyaDevicesController.status('all'));
    userDevicesController.setState(req.body.name, false);
});

export default actions;