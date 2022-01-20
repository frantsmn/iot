import TuyAPI from 'tuyapi'
import loggerCreator from '../logger/index'

const log = loggerCreator('tuya-device');

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
    #reconnection: boolean;                     // Флаг текущего процесса переподключения устройства

    constructor({type, id, key, name}: RawTuyaDevice) {
        this.type = type
        this.id = id
        this.name = name
        this.#device = new TuyAPI({id, key, version: 3.3})

        this.#device.on('connected', () => log.info(`➕ <${this.name}> подключено`));
        this.#device.on('disconnected', async () => {
            log.warn(`❌ <${this.name}> отключено!`);
            await this.reconnect();
        });
        this.#device.on('data', data => {
            if (!data || !data.dps) return;

            switch (this.type) {
                case 'bulb': {
                    if (this.status === Boolean(data.dps['20'])) break;
                    this.status = data.dps['20'];
                    log.info(`${this.status ? '⚫' : '⚪'} <${this.name}> ${this.status ? 'ВКЛ' : 'ВЫКЛ'}`);
                    break;
                }
                case 'plug': {
                    if (this.status === Boolean(data.dps['1'])) break;
                    this.status = data.dps['1'];
                    log.info(`${this.status ? '⚫' : '⚪'} <${this.name}> ${this.status ? 'ВКЛ' : 'ВЫКЛ'}`);
                    break;
                }
                default:
                    break;
            }
        });
        this.#device.on('error', async error => {
            log.error(`Ошибка с <${this.name}>: ${error}`);
            await this.reconnect();
        });

        this.connect().catch((error) => {
            log.error(`Ошибка при создании TuyaDevice <${this.name}>`, error);
        });
    }

    async connect(): Promise<boolean> {
        try {
            await this.#device.find();
            await this.#device.connect();
            return true;
        } catch (error) {
            log.error(`Ошибка при подключении <${this.name}>`, error);
            await this.reconnect();
            return false;
        }
    }

    async disconnect(): Promise<boolean> {
        if (!this.isConnected) {
            log.silly(`Устройство <${this.name}> уже отключено`);
            return true;
        }
        try {
            await this.#device.disconnect();
            return true;
        } catch (error) {
            log.error(`Ошибка при отключении <${this.name}>`, error);
            return false;
        }
    }

    async reconnect(): Promise<void> {
        if (this.#reconnection) {
            log.silly(`Отмена повторного переподключения к <${this.name}>!`);
            return;
        }
        this.#reconnection = true;
        log.info(`Переподключение к <${this.name}>...`);

        let attemptCounter = 1;
        let timeoutSec = 5;
        const reconnectAttempt = () => {
            log.info(`Попытка подключения #${attemptCounter++} к <${this.name}> через ${timeoutSec} сек...`);
            setTimeout(async () => {
                const result = await this.connect();
                if (result) {
                    this.#reconnection = false;
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
                    return;
                }
                case 'plug': {
                    this.status = await this.#device.toggle(1);
                    return;
                }
            }
        } catch (error) {
            log.error(`Ошибка при переключении состояния <${this.name}>`, error);
        }
    }

    async on(): Promise<boolean> {
        try {
            switch (this.type) {
                case 'bulb': {
                    await this.#device.set({dps: 20, set: true});
                    this.status = await this.#device.get({dps: 20});
                    return;
                }
                case 'plug': {
                    await this.#device.set({dps: 1, set: true});
                    this.status = await this.#device.get({dps: 1});
                    return;
                }
            }
        } catch (error) {
            log.error(`Ошибка при включении <${this.name}>`, error);
        }
    }

    async off(): Promise<Boolean> {
        try {
            switch (this.type) {
                case 'bulb': {
                    this.#device.set({dps: 20, set: false});
                    this.status = await this.#device.get({dps: 20});
                    return;
                }
                case 'plug': {
                    this.#device.set({dps: 1, set: false});
                    this.status = await this.#device.get({dps: 1});
                    return;
                }
            }
        } catch (error) {
            log.error(`Ошибка при выключении <${this.name}>`, error);
        }
    }

    /**
     * Установить состояние для устройства
     * @param data
     */
    async dps(data) {
        await this.#device.set({
            multiple: true,
            data
        });
    }

    /**
     * Запросить текущий статус устройства
     */
    async fetchCurrentStatus(): Promise<boolean> {
        try {
            switch (this.type) {
                case 'bulb': {
                    return Boolean(await this.#device.get({dps: 20}));
                }
                case 'plug': {
                    return Boolean(await this.#device.get({dps: 1}));
                }
            }
        } catch (error) {
            log.error(`Ошибка при получении статуса <${this.name}>`, error);
        }
    }

    /**
     *  Текущее соединение с устройством
     *  @returns {boolean}
     */
    get isConnected(): boolean {
        return this.#device.isConnected();
    }

    set status(value: any) {
        this.#status = Boolean(value);
    }

    get status() {
        return this.#status;
    }
}
