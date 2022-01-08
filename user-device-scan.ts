import path from 'path'
import arpScanner from 'arpscan'
import UserDevice from './model/user-device'

interface RawUserDevice {
    name: string
    mac_wifi: string
    mac_bluetooth?: string
}

interface UserDeviceResult {
    name: string
    isWifiConnected: boolean
    isBluetoothConnected?: boolean
    isError: boolean
    errorMsg: string
}

const USER_DEVICES_PATH = path.resolve(require('os').homedir(), '.iot/user-devices.json')

class UserDevicesScan {
    devices: Array<UserDevice>;

    constructor(path) {
        this.devices = Array.from(require(path)).map((rawDevice: RawUserDevice) => new UserDevice(rawDevice))
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
}

const userDeviceScan = new UserDevicesScan(USER_DEVICES_PATH);

setInterval(() => {
    const res = userDeviceScan.scanAll();
    res.then((r) => {
        console.log('-- Device scan result --');
        console.log(r);
    });
}, 10000)
