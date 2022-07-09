import path from 'path';
import {homedir} from 'os';
import UserDevice from './model/UserDevice';
import UserDevicesController from './controller/UserDevicesController';
import type {RawUserDevice} from './types';

const USER_DEVICES_PATH = path.resolve(homedir(), '.iot/user-devices.json');
// eslint-disable-next-line import/no-dynamic-require
const userDevices: Array<UserDevice> = Array.from(require(USER_DEVICES_PATH))
    .map((rawUserDevice: RawUserDevice) => new UserDevice(rawUserDevice));
const userDevicesController = new UserDevicesController(userDevices);

export default userDevicesController;
