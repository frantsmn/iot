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
            console.log(`Устройство «${this.name}» подключено!`);
            this.#connected = true;
            this.#eventMap?.connect && this.#eventMap.connect();
        });

        this.#device.on('disconnected', () => {
            console.log(`Устройство «${this.name}» отключено!`);
            this.#connected = false;
            this.#eventMap?.disconnect && this.#eventMap.disconnect();
        });

        this.#device.on('data', data => {
            if (!data.dps || this.#status === data.dps['1']) return;
            this.#status = data.dps['1'];
            this.#eventMap.data && this.#eventMap.data({status: this.#status});
        });

        this.#device.on('error', async error => {
            console.log(`Ошибка с устройством «${this.name}»: ${error}`);
            this.#eventMap.error && this.#eventMap.error(error);
            await this.reconnect();
        });
    }

    async connect(): Promise<void> {
        await this.#device.find();
        await this.#device.connect();
    }

    async disconnect(): Promise<void> {
        if (this.#connected) return await this.#device.disconnect()
        else console.log(`Устройство «${this.name}» уже отключено`)
    }

    async reconnect(): Promise<void> {
        if (this.#connected) {
            console.log(`Отключение от устройства «${this.name}»...`);
            await this.disconnect();
        }
        console.log(`Переподключение к устройству «${this.name}» через 5 секунд...`);
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
