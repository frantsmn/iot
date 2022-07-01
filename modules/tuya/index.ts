import path from 'path';
import {homedir} from 'os';
import TuyaDevice, {RawTuyaDevice} from './model/TuyaDevice';
import TuyaDevicesController from './controller/tuya-devices-controller';

const TUYA_DEVICES_PATH = path.resolve(homedir(), '.iot/tuya-devices.json');
// eslint-disable-next-line import/no-dynamic-require
const tuyaDevices: Array<TuyaDevice> = Array.from(require(TUYA_DEVICES_PATH))
    .map((rawTuyaDevice: RawTuyaDevice) => new TuyaDevice(rawTuyaDevice));
const tuyaDeviceController = new TuyaDevicesController(tuyaDevices);

export default tuyaDeviceController;
