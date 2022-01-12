interface RawUserDevice {
    name: string
    mac_wifi: string
    mac_bluetooth?: string
    ip: string
}

export default class UserDevice {
    readonly name: string
    readonly ip: string
    readonly macWifi: string
    readonly macBluetooth?: string
    #isConnected: boolean
    #lastUpdate: number
    #lastCheck: number

    constructor(device: RawUserDevice) {
        this.name = device.name;
        this.macWifi = device.mac_wifi;
        this.ip = device.ip;
        this.#isConnected = false;
        this.#lastUpdate = null;
        this.#lastCheck = null;
    }

    setState(state: boolean) {
        if (this.#isConnected !== state) {
            this.#isConnected = state;
            this.#lastUpdate = Date.now();
            // TODO Logger
            console.log(`[${(new Date).toLocaleTimeString('ru-RU')}] Устройство "${this.name}" ${state ? 'в сети' : 'отключено'}`);
        }
        // Обновляет время последней проверки
        this.#lastCheck = Date.now();
    }

    /**
     * Состояние устройства
     * @returns boolean
     */
    get isConnected() {
        return this.#isConnected;
    }

    /**
     * Время последней попытки обновления
     * состояния устройства
     * @returns {number} - timestamp
     */
    get lastCheck() {
        return this.#lastCheck;
    }

    /**
     * Время последней успешной попытки обновления
     * состояния устройства
     * @returns {number} - timestamp
     */
    get lastUpdate() {
        return this.#lastUpdate;
    }
}
