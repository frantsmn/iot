import TuyaDevice from "../model/tuya-device"

type DeviceActionTypes = 'on' | 'off' | 'toggle' | string;
type DeviceNames = 'all' | string;

export default class TuyaDevicesController {
    devices: Array<TuyaDevice>;

    constructor(tuyaDevices: Array<TuyaDevice>) {
        this.devices = tuyaDevices;
        this.devices.forEach(async device => await device.connect());
    }

    /**
     * Получить статус
     * @param deviceName имя устройства
     */
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

    /**
     * Выполнить действие
     * @param deviceName имя устройства
     * @param actionType тип действия
     */
    async action(
        deviceName: DeviceNames,
        actionType: DeviceActionTypes
    ): Promise<void> {
        if (deviceName === 'all') {
            for await (const device of this.devices) {
                if (actionType in device) {
                    await device[actionType]();
                }
            }
        } else {
            const device = this.devices.find(({name}) => name === deviceName);
            if (device && actionType in device) {
                await device[actionType]();
            }
        }
    }
}
