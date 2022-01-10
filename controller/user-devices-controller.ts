import arpScanner from 'arpscan'
import find from 'local-devices'
import UserDevice from '../model/user-device'

export default class UserDevicesController {
    devices: Array<UserDevice>;

    constructor(userDevices: Array<UserDevice>) {
        this.devices = userDevices;
    }

    private async scanDevice(device: UserDevice): Promise<Boolean> {

        if (process.platform !== "linux") {
            console.log('Not a linux environment!')
            return Promise.resolve(null);
        }

        // arpScanner(onResult, {command: 'arp-scan', args: ['-l'], sudo: true});

        // Find a single device by ip address.
        const result = await find(device.ip);
        console.log('scan result: ',result)
        onResult(result);
        // .then(device => {
        //     console.log(device)
        //     /*
        //       {
        //         name: '?',
        //         ip: '192.168.0.10',
        //         mac: '...'
        //       }
        //     */
        // })

        function onResult(data) {
            if (data) {
                device.setState({timestamp: Date.now(), status: true});
                return true;
            }

            return false;
        }
    }

    async scanAll(): Promise<Array<Boolean>> {
        const devicePromises = this.devices.map((device) => this.scanDevice(device));
        return await Promise.all(devicePromises);
    }

    isAnyDeviceActualNow() {
        return Boolean(this.devices.find(device => device.isActual));
    }
}
