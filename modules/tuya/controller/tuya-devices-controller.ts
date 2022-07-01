import TuyaDevice from '../model/TuyaDevice';

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
                return this.getAllDevicesStatuses();
            default:
                return this.getDeviceStatus(deviceName);
        }
    }

    /**
     * Выполнить действие
     * @param {string} deviceName имя устройства
     * @param {'all' | string} actionType тип действия
     * @param {object} data данные из запроса
     */
    public async action(
        deviceName: DeviceNames,
        actionType: DeviceActionTypes,
        data = {},
    ): Promise<void> {
        switch (deviceName) {
            case 'all':
                return this.callActionForAllDevices(actionType, data);
            default:
                return this.callDeviceAction(deviceName, actionType, data);
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
            ...await this.getDeviceDps(deviceName),
            connected: device.isConnected,
            status: await device.fetchCurrentStatus(),
        };
    }

    /**
     * Метод получения конфигурации устройства
     * @param {string} deviceName имя устройства
     * @private
     */
    public async getDeviceDps(deviceName: string) {
        const device = this.devices.find(({name}) => name === deviceName);

        return device.getDps();
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
        for await (const device of this.devices) {
            if (actionType in device) {
                await device[actionType](data);
            }
        }
    }
}
