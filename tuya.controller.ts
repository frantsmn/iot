import TuyaDevice from "./tuya-device"
import path from 'path'

class TuyaController {
    devices: Array<TuyaDevice>;

    constructor(rawTuyaDevices: Array<any>) {
        this.devices = rawTuyaDevices.map((rawDevice) => new TuyaDevice(rawDevice))
        this.devices.forEach(async device => {
                const connectResult = await device.connect();
                if (!connectResult) await device.reconnect();
                await device.on('disconnect', () => device.reconnect());
                await device.on('error', () => device.reconnect());
            }
        );
    }

    status(deviceName) {
        const device = this.devices.find(({name}) => name === deviceName);
        if (device) {
            const {connected, status} = device;
            return {connected, status};
        }
    }

    async action(deviceName, actionType) {
        const device = this.devices.find(({name}) => name === deviceName);
        if (actionType
            && device
            && actionType in device) {
            await device[actionType]();
        }
    }
}

const TUYA_DEVICES_PATH = path.resolve(require('os').homedir(), '.iot/tuya-devices.json');
export default new TuyaController(Array.from(require(TUYA_DEVICES_PATH)));
