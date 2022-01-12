import TuyAPI from 'tuyapi'

interface RawTuyaDevice {
    type: 'bulb' | 'plug'
    id: number
    key: number
    name: string
}

export default class TuyaDevice {
    readonly type: 'bulb' | 'plug';             // Тип устройства
    readonly id: any;                           // Уникальный идентификатор устройства
    readonly name: any;                         // Наименование устройства
    #device: any;                               // TuyAPI объект устройства
    #status: boolean;                           // Статус устройства (вкл/выкл)
    #connected: boolean;                        // Состояние подключения устройства (подкл/откл)
    #reconnection: boolean;                     // Флаг текущего процесса переподключения устройства

    constructor({type, id, key, name}: RawTuyaDevice) {
        this.type = type
        this.id = id
        this.name = name
        this.#device = new TuyAPI({id, key, version: 3.3})

        this.#device.on('connected', () => {
            this.#connected = true;
            //TODO Logger
            console.log(`➕ Устройство «${this.name}» подключено!`);
        });
        this.#device.on('disconnected', () => {
            this.#connected = false;
            this.reconnect();
            //TODO Logger
            console.log(`❌ Устройство «${this.name}» отключено!`);
        });
        this.#device.on('data', data => {
            if (!data || !data.dps) return;

            switch (this.type) {
                // Не работает :(
                // case 'bulb': {
                //     if (this.status === Boolean(data.dps['20'])) break;
                //     this.status = Boolean(data.dps['20']);
                //     break;
                // }
                case 'plug': {
                    if (this.status === Boolean(data.dps['1'])) break;
                    this.status = data.dps['1'];
                    break;
                }
                default:
                    break;
            }

            // TODO Logger
            console.log(
                `[${(new Date).toLocaleTimeString('ru')}] `,
                this.status ? '⚫ ' : '⚪ ',
                `«${this.name}» `,
                this.status ? 'включено' : 'выключено'
            );
        });
        this.#device.on('error', async error => {
            console.log(`Ошибка с устройством «${this.name}»: ${error}`);
            this.reconnect();
        });
    }

    async connect(): Promise<boolean> {
        if (this.#connected) {
            console.log(`[tuya-device] Устройство «${this.name}» уже подключено`);
            return true;
        }
        try {
            await this.#device.find();
            await this.#device.connect();
            return true;
        } catch (error) {
            console.error(
                `[tuya-device] Ошибка при подключении устройства «${this.name}»\n`,
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
        if (this.#reconnection) {
            return console.log(`[tuya-device] Отмена повтороного переподключения!`);
        }
        this.#reconnection = true;
        console.log(`[tuya-device] Переподключение к устройству «${this.name}»...`);

        let attemptCounter = 1;
        let timeoutSec = 5;
        const reconnectAttempt = () => {
            console.log(`[tuya-device] Попытка подключения #${attemptCounter++} к «${this.name}» через ${timeoutSec} сек...`);
            setTimeout(async () => {
                const result = await this.connect();
                if (result) {
                    this.#reconnection = false;
                    return console.log(`[tuya-device] Устройство «${this.name}» переподключено!`);
                } else {
                    timeoutSec += Boolean(attemptCounter % 5) ? 0 : 5;
                    reconnectAttempt();
                }
            }, timeoutSec * 1000);
        }
        reconnectAttempt();
    }

    async toggle(): Promise<boolean> {
        try {
            switch (this.type) {
                case 'bulb': {
                    this.status = await this.#device.toggle(20);
                    return this.status;
                }
                case 'plug': {
                    this.status = await this.#device.toggle(1);
                    return this.status;
                }
            }
        } catch (error) {
            // TODO Logger
            console.log(`Ошибка при переключении состояния устройства ${this.name}`, error);
        }
    }
    async on(): Promise<boolean> {
        try {
            switch (this.type) {
                case 'bulb': {
                    await this.#device.set({dps: 20, set: true});
                    this.status = await this.#device.get({dps: 20});
                    return this.status;
                }
                case 'plug': {
                    await this.#device.set({dps: 1, set: true});
                    this.status = await this.#device.get({dps: 1});
                    return this.status;
                }
            }
        } catch (error) {
            // TODO Logger
            console.log(`Ошибка при включении устройства ${this.name}`, error);
        }
    }
    async off(): Promise<Boolean> {
        try {
            switch (this.type) {
                case 'bulb': {
                    this.#device.set({dps: 20, set: false});
                    this.status = await this.#device.get({dps: 20});
                    return this.status;
                }
                case 'plug': {
                    this.#device.set({dps: 1, set: false});
                    this.status = await this.#device.get({dps: 1});
                    return this.status;
                }
            }
        } catch (error) {
            // TODO Logger
            console.log(`Ошибка при выключении устройства ${this.name}`, error);
        }
    }

    /**
     * Получить статус устройства
     */
    async getCurrentStatus(): Promise<boolean> {
        try {
            switch (this.type) {
                case 'bulb': {
                    return await this.#device.get({dps: 20});
                }
                case 'plug': {
                    return await this.#device.get({dps: 1});
                }
            }
        } catch (error) {
            // TODO Logger
            console.log(`Ошибка при получении статуса устройства ${this.name}`, error);
        }
    }

    /**
     *  Cоединение с устройством
     */
    get connected(): boolean {
        return this.#connected;
    }

    set status(value: any) {
        this.#status = Boolean(value);
    }

    get status() {
        return this.#status;
    }
}
