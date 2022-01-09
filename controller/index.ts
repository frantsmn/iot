import {userDevices} from '../model'
import {tuyaDevices} from "../model";

import UserDevicesController from "../controller/user-devices-controller";
import TuyaDevicesController from "../controller/tuya-devices-controller";

export const tuyaDeviceController = new TuyaDevicesController(tuyaDevices);
export const userDeviceController = new UserDevicesController(userDevices);
