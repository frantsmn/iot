import arpScanner from 'arpscan'
import UserDevice from '../model/user-device'

interface UserDeviceResult {
    name: string
    isWifiConnected: boolean
    isBluetoothConnected?: boolean
    isError: boolean
    errorMsg: string
}

export default class UserDevicesController {
    devices: Array<UserDevice>;

    constructor(userDevices: Array<UserDevice>) {
        this.devices = userDevices;
    }

    private scanDevice(device: UserDevice): Promise<UserDeviceResult> {

        if (process.platform !== "linux") {
            console.log('Not a linux environment!')
            return Promise.resolve(null);
        }

        return new Promise((resolve, reject) => {

            arpScanner(onResult, {command: 'arp-scan', args: ['-l'], sudo: true});

            function onResult(error, data) {
                const result: UserDeviceResult = {
                    name: device.name,
                    isWifiConnected: false,
                    // isBluetoothConnected: false,
                    isError: true,
                    errorMsg: `Ошибка при поиске устройства «${device.name}». ${error}`,
                }

                if (error) {
                    result.isError = true;
                    result.errorMsg = `Ошибка при поиске устройства «${device.name}». ${error}`;
                    reject(result);
                } else {
                    result.isError = false;
                    result.errorMsg = ``;
                }

                // console.log(data, '---', name, macWifi);
                if (data !== null && data.some(dev => dev.mac === device.macWifi)) {
                    result.isWifiConnected = true;
                    device.setState({timestamp: Date.now(), status: true});
                }

                resolve(result);
            }
        })
    }

    async scanAll(): Promise<Array<UserDeviceResult>> {
        const devicePromises = this.devices.map((device) => this.scanDevice(device));
        return await Promise.all(devicePromises);
    }

    isAnyDeviceActualNow() {
        return Boolean(this.devices.find(device => device.isActual));
    }
}
