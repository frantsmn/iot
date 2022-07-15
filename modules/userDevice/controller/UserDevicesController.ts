import find from 'local-devices';
import UserDevice from '../model/UserDevice';

export default class UserDevicesController {
    devices: Array<UserDevice>;

    constructor(userDevices: Array<UserDevice>) {
        this.devices = userDevices;

        if (process.platform !== 'linux') {
            console.warn('[UserDeviceController] Not a linux platform!');
        }
    }

    // eslint-disable-next-line class-methods-use-this
    async scanDevice(device: UserDevice) {
        if (process.platform !== 'linux') return;

        const result: any = await find(device.ip);

        if (result && result.mac.toUpperCase() === device.macWifi) {
            device.setState(true);
        } else {
            device.setState(false);
        }
    }

    async scanAll() {
        const devicePromises = this.devices.map((device) => this.scanDevice(device));
        return Promise.all(devicePromises);
    }

    setState(deviceName, state) {
        this.devices.find(device => (device.name === deviceName)).setState(state);
    }

    get isAnyDeviceConnected() {
        return Boolean(this.devices.find((device) => device.isConnected));
    }
}
