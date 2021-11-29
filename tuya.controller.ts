import TuyaDevice from "./tuya-device"
import path from 'path'

type DeviceActionTypes = 'turnOn' | 'turnOff' | 'toggle' | string;
type DeviceNames = 'all' | string;

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

    status(deviceName: string) {
        if (deviceName === 'all') {
            const response = {};
            for (const {name, connected, status} of this.devices) {
                response[name] = {connected, status};
            }
            return response;
        } else {
            const device = this.devices.find(({name}) => name === deviceName);
            if (!device) return;
            const {connected, status} = device;
            return {connected, status};
        }
    }

    async action(deviceName: DeviceNames, actionType: DeviceActionTypes) {
        if (deviceName === 'all') {
            for await (const device of this.devices) {
                if (actionType in device) {
                    await device[actionType]();
                }
            }
        } else {
            const device = this.devices.find(({name}) => name === deviceName);
            if (actionType
                && device
                && actionType in device) {
                await device[actionType]();
            }
        }
    }
}

const TUYA_DEVICES_PATH = path.resolve(require('os').homedir(), '.iot/tuya-devices.json');
export default new TuyaController(Array.from(require(TUYA_DEVICES_PATH)));
