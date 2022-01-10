import find from 'local-devices'
import UserDevice from '../model/user-device'

export default class UserDevicesController {
    devices: Array<UserDevice>;

    constructor(userDevices: Array<UserDevice>) {
        this.devices = userDevices;
    }

    async scanDevice(device: UserDevice) {
        if (process.platform !== "linux") {
            console.log('Not a linux environment!')
        }

        // Find a single device by ip address.
        const result: any = await find(device.ip);
        /*
        todo: replace "any" by interface
        result:
          {
            name: '?',
            ip: '192.168.10.10',
            mac: '...'
          }
        */
        if (result && result.mac === device.macWifi) {
            device.setState({timestamp: Date.now(), status: true});
        }
    }

    async scanAll() {
        const devicePromises = this.devices.map((device) => this.scanDevice(device));
        return await Promise.all(devicePromises);
    }

    isAnyDeviceActualNow() {
        return Boolean(this.devices.find(device => device.isActual));
    }
}
