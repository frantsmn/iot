import find from 'local-devices'
import UserDevice from '../model/user-device'
import loggerCreator from "../logger"
const log = loggerCreator('user-devices-controller');

export default class UserDevicesController {
    devices: Array<UserDevice>;

    constructor(userDevices: Array<UserDevice>) {
        this.devices = userDevices;

        if (process.platform !== "linux") {
            log.warn('Not a linux environment!')
        }
    }

    async scanDevice(device: UserDevice) {
        if (process.platform !== "linux") return;

        const result: any = await find(device.ip);

        if (result && result.mac.toUpperCase() === device.macWifi) {
            device.setState(true);
        } else {
            device.setState(false);
        }
    }

    async scanAll() {
        const devicePromises = this.devices.map((device) => this.scanDevice(device));
        return await Promise.all(devicePromises);
    }

    isAnyDeviceConnected() {
        return Boolean(this.devices.find(device => device.isConnected));
    }
}
