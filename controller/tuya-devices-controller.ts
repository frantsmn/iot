import TuyaDevice from "../model/tuya-device"

type DeviceActionTypes = 'on' | 'off' | 'toggle' | 'dps' | 'rgb' | string;
type DeviceNames = 'all' | string;

export default class TuyaDevicesController {
    devices: Array<TuyaDevice>;

    constructor(tuyaDevices: Array<TuyaDevice>) {
        this.devices = tuyaDevices;
    }

    /**
     * Получить статус
     * @param {'all' | string} deviceName имя устройства
     */
    public async status(deviceName: 'all' | string) {
        switch (deviceName) {
            case 'all':
                return await this.getAllDevicesStatuses();
            default:
                return await this.getDeviceStatus(deviceName);
        }
    }

    /**
     * Выполнить действие
     * @param {string} deviceName имя устройства
     * @param {'all' | string} actionType тип действия
     * @param {object} data данные из запроса
     */
    public async action(deviceName: DeviceNames, actionType: DeviceActionTypes, data = {}): Promise<void> {
        switch (deviceName) {
            case 'all':
                return await this.callActionForAllDevices(actionType, data);
            default:
                return await this.callDeviceAction(deviceName, actionType, data);
        }
    }


    /**
     * Метод получения статуса устройства
     * @param {string} deviceName имя устройства
     * @private
     */
    private async getDeviceStatus(deviceName: string) {
        const device = this.devices.find(({name}) => name === deviceName);
        return {
            connected: device.isConnected,
            status: await device.fetchCurrentStatus()
        }
    }

    /**
     * Метод получения статусов всех устройств
     * @private
     */
    private async getAllDevicesStatuses() {
        const response = {};
        for await (const device of this.devices) {
            const {name} = device;
            response[name] = await this.getDeviceStatus(name);
        }
        return response;
    }

    /**
     * Метод выполнения действия
     * @param {string} deviceName имя устройства
     * @param {'all' | string} actionType тип действия
     * @param {object} data данные из запроса
     */
    private async callDeviceAction(deviceName: DeviceNames, actionType: DeviceActionTypes, data) {
        const device = this.devices.find(({name}) => name === deviceName);
        if (device && actionType in device) {
            await device[actionType](data);
        }
    }

    /**
     * Метод выполнения действия для всех устройств
     * @param {'all' | string} actionType тип действия
     * @param {object} data данные из запроса
     */
    private async callActionForAllDevices(actionType: DeviceActionTypes, data) {
        for (const device of this.devices) {
            if (actionType in device) {
                await device[actionType](data);
            }
        }
    }
}
