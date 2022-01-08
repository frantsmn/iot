interface RawUserDevice {
    name: string
    mac_wifi: string
    mac_bluetooth?: string
}

interface DeviceState {
    timestamp: number
    status: boolean
}

export default class UserDevice {
    readonly name: string
    readonly macWifi: string
    readonly macBluetooth?: string
    lastCheck: number
    lastSuccessfulCheck: number
    #isActual: boolean
    actualityTime: number
    #timeoutId: NodeJS.Timeout;

    constructor(device: RawUserDevice) {
        this.name = device.name;
        this.macWifi = device.mac_wifi;
        this.lastCheck = null;
        this.lastSuccessfulCheck = null;
        this.#isActual = false;
        this.actualityTime = 30000;
        this.#timeoutId = null;
    }

    /**
     * Устанавливает состояние актуальности для устройства пользователя
     */
    setState({timestamp, status}: DeviceState) {
        // Обновляет время последней проверки
        this.lastCheck = timestamp;
        // Обновляет время последней успешной проверки
        this.lastSuccessfulCheck = status ? timestamp : this.lastSuccessfulCheck;
        // Обновляет актуальность устройства
        this.isActual = status || this.isActual;
        // Устанавливает таймер актуальности устройства
        this.setActualityTimeout();
    }

    /**
     * Устанавливает таймер по истечении которого
     * актуальность устройства будет утеряна
     */
    setActualityTimeout() {
        clearTimeout(this.#timeoutId);
        this.#timeoutId = setTimeout(() => {
            this.isActual = false;
        }, this.actualityTime)
    }

    set isActual(state: boolean) {
        if (this.#isActual !== undefined && this.#isActual != state) {
            console.log(`Устройство ${this.name} ${state ? 'снова актуально' : 'больше не актуально'}`);
        }

        this.#isActual = state;
    }

    get isActual() {
        return this.#isActual;
    }
}
