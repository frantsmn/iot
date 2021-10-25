import TuyAPI from 'tuyapi'

interface RawTuyaDevice {
    id: number
    key: number
    name: string
}

interface TuyaDeviceEventMap {
    connect?: () => any
    disconnect?: () => any
    data?: (TyuaDeviceEventData) => any
    error?: (error: any) => any
}

export default class TuyaDevice {
    readonly id: any;
    readonly name: any;
    #device: any;
    #status: boolean;
    #connected: boolean;
    readonly #eventMap: TuyaDeviceEventMap;

    constructor({id, key, name}: RawTuyaDevice) {
        this.id = id
        this.name = name
        this.#device = new TuyAPI({id, key, version: 3.3})
        this.#eventMap = {}

        this.#device.on('connected', () => {
            this.#connected = true;
            this.#eventMap?.connect && this.#eventMap.connect();
            console.log(`Устройство «${this.name}» подключено!`);
        });

        this.#device.on('disconnected', () => {
            this.#connected = false;
            this.#eventMap?.disconnect && this.#eventMap.disconnect();
            console.log(`Устройство «${this.name}» отключено!`);
        });

        this.#device.on('data', data => {
            if (!data.dps || this.#status === data.dps['1']) return;
            this.#status = data.dps['1'];
            this.#eventMap.data && this.#eventMap.data({status: this.#status});
        });

        this.#device.on('error', async error => {
            this.#eventMap.error && this.#eventMap.error(error);
            console.log(`Ошибка с устройством «${this.name}»: ${error}`);
            await this.reconnect();
        });

    }

    async connect(): Promise<void> {
        try {
            await this.#device.find();
            await this.#device.connect();
        } catch {
            await this.reconnect();
        }
    }

    async disconnect(): Promise<void> {
        if (this.#connected) return await this.#device.disconnect();
    }

    async reconnect(): Promise<void> {
        console.log(`Отключение от устройства «${this.name}»...`);
        await this.disconnect();
        console.log(`Подключение к устройству «${this.name}» через 5 секунд...`);
        setTimeout(() => this.connect(), 5000);
    }

    async toggle(): Promise<void> {
        if (this.#connected) await this.#device.toggle(1);
    }

    async turnOn(): Promise<void> {
        if (this.#connected) await this.#device.set({set: true});
    }

    async turnOff(): Promise<void> {
        if (this.#connected) await this.#device.set({set: false});
    }

    /**
     * Определяет callback-функцию для событий
     * @param eventName
     * @param callback
     */
    on(eventName: 'connect' | 'disconnect' | 'data' | 'error', callback: () => any) {
        this.#eventMap[eventName] = callback;
    }

    /**
     * Cтатус устройства
     */
    get status(): boolean {
        return this.#status;
    }

    /**
     *  Cоединение с устройством
     */
    get connected(): boolean {
        return this.#connected;
    }
}
