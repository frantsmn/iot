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
    readonly id: any;                           // Уникальный идентификатор устройства
    readonly name: any;                         // Наименование устройства
    #device: any;                               // TuyAPI объект устройства
    #status: boolean;                           // Статус устройства (вкл/выкл)
    #connected: boolean;                        // Состояние подключения устройства (подкл/откл)
    #reconnection: boolean;                     // Флаг текущего процесса переподключения устройства
    readonly #eventMap: TuyaDeviceEventMap;     // Карта методов (коллбэков) на события устройства

    constructor({id, key, name}: RawTuyaDevice) {
        this.id = id
        this.name = name
        this.#device = new TuyAPI({id, key, version: 3.3})
        this.#eventMap = {}

        this.#device.on('connected', () => {
            console.log(`➕ Устройство «${this.name}» подключено!`);
            this.#connected = true;
            this.#eventMap?.connect && this.#eventMap.connect();
        });

        this.#device.on('disconnected', () => {
            console.log(`❌ Устройство «${this.name}» отключено!`);
            this.#connected = false;
            this.#eventMap?.disconnect && this.#eventMap.disconnect();
        });

        this.#device.on('data', data => {
            if (!data.dps || this.#status === data.dps['1']) return;
            this.#status = data.dps['1'];
            this.#eventMap.data && this.#eventMap.data({status: this.#status});

            console.log(
                `[${(new Date).toLocaleTimeString('ru')}] `,
                this.#status ? '⚫ ' : '⚪ ',
                `«${this.name}» `,
                this.#status ? 'включено' : 'выключено'
            );
        });

        this.#device.on('error', async error => {
            console.log(`Ошибка с устройством «${this.name}»: ${error}`);
            this.#eventMap.error && this.#eventMap.error(error);
        });
    }

    async connect(): Promise<boolean> {
        if (this.#connected) {
            console.log(`[tuya-device.ts] connect()\nУстройство «${this.name}» уже подключено`);
            return true;
        }
        try {
            await this.#device.find();
            await this.#device.connect();
            return true;
        } catch (error) {
            console.error(
                `[tuya-device.ts] connect()\nОшибка при подключении устройства «${this.name}»\n`,
                error
            );
            return false;
        }
    }

    async disconnect(): Promise<boolean> {
        if (!this.#connected) {
            console.log(`[tuya-device.ts] disconnect()\nУстройство «${this.name}» уже отключено`);
            return true;
        }
        try {
            await this.#device.disconnect();
            return true;
        } catch (error) {
            console.error(
                `[tuya-device.ts] disconnect()\nОшибка при отключении устройства «${this.name}»\n`,
                error
            );
            return false;
        }
    }

    async reconnect(): Promise<void> {
        if (this.#reconnection) return console.log(`[tuya-device.ts] > reconnect | Переподключение к устройству «${this.name}» уже запущено. Повтороное переподключение отменено!`);
        this.#reconnection = true;
        console.log(`[tuya-device.ts] > reconnect | Переподключение к устройству «${this.name}»`);

        // if (this.#connected) {
        //     console.log(`[tuya-device.ts] > reconnect | Отключение от устройства «${this.name}»...`);
        //     await this.disconnect();
        // }

        let attemptCounter = 1;
        let timeoutSec = 5;
        const reconnectAttempt = () => {
            console.log(`[tuya-device.ts] > reconnect | Попытка подключения #${attemptCounter++} к устройству «${this.name}» через ${timeoutSec} сек...`);
            setTimeout(async () => {
                const result = await this.connect();
                if (result) {
                    this.#reconnection = false;
                    return console.log(`[tuya-device.ts] > reconnect | Устройство «${this.name}» переподключено!`);
                } else {
                    timeoutSec += Boolean(attemptCounter % 5) ? 0 : 5;
                    reconnectAttempt();
                }
            }, timeoutSec * 1000);
        }
        reconnectAttempt();
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
