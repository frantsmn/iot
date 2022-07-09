import loggerCreator from '../../logger';
import type {RawUserDevice} from '../types';

const log = loggerCreator('user-device');

export default class UserDevice {
    readonly name: string;
    readonly ip: string;
    readonly macWifi: string;
    // readonly macBluetooth?: string;
    #isConnected: boolean;
    #lastChangeDate: Date | null;
    #lastCheckDate: Date | null;

    constructor(device: RawUserDevice) {
        this.name = device.name;
        this.macWifi = device.mac_wifi;
        this.ip = device.ip;
        this.#isConnected = false;
        this.#lastChangeDate = null;
        this.#lastCheckDate = null;
    }

    setState(state: boolean) {
        if (this.#isConnected !== state) {
            this.#isConnected = state;
            this.#lastChangeDate = new Date();
            log.info({
                message: `<${this.name}> ${state ? 'появился в сети' : 'отключен от сети'}`,
                isTg: true,
            });
        }
        // Обновляет время последней проверки
        this.#lastCheckDate = new Date();
    }

    /**
     * Состояние устройства
     * @returns boolean
     */
    get isConnected() {
        return this.#isConnected;
    }

    /**
     * Время последней проверки
     * @returns {number} - timestamp
     */
    get lastCheckDate() {
        return this.#lastCheckDate;
    }

    /**
     * Время последнего изменения состояния устройства
     * @returns {number} - timestamp
     */
    get lastChangeDate() {
        return this.#lastChangeDate;
    }
}
