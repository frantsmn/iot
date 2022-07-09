import TuyAPI from 'tuyapi';
import loggerCreator from '../../logger';
import sceneAdapter, {SceneConfig} from './adapters/scene';
import colorAdapter, {RGBColor} from './adapters/color';

export interface RawTuyaDevice {
    type: 'bulb' | 'plug'
    id: number
    key: number
    name: string
}

const log = loggerCreator('tuya-device');

// todo Extend class from TuyAPI
// todo Extend for each type => 'bulb' | 'plug'
export default class TuyaDevice {
    // Тип устройства
    readonly type: 'bulb' | 'plug';
    // Уникальный идентификатор устройства
    readonly id: any;
    // Наименование устройства
    readonly name: any;
    // TuyAPI объект устройства
    #device: any;
    // Статус устройства (вкл/выкл)
    #status: boolean;
    // Флаг текущего процесса переподключения устройства
    #reconnection: boolean;

    constructor({
        type,
        id,
        key,
        name,
    }: RawTuyaDevice) {
        this.type = type;
        this.id = id;
        this.name = name;
        this.#device = new TuyAPI({id, key, version: 3.3});

        this.#device.on('connected', () => log.info(`➕ <${this.name}> подключено`));
        this.#device.on('disconnected', async () => {
            log.warn(`❌ <${this.name}> отключено!`);
            await this.reconnect();
        });
        this.#device.on('data', (data) => {
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
        this.#device.on('error', async (error) => {
            log.error({
                message: `Ошибка с <${this.name}>: ${error}`,
                isTgSilent: true,
            });
            await this.reconnect();
        });

        this.connect().catch((error) => {
            log.error({
                message: `Ошибка при создании TuyaDevice <${this.name}>: ${error}`,
                isTgSilent: true,
            });
        });
    }

    /**
     *  Текущее соединение с устройством
     *  @returns {boolean}
     */
    get isConnected(): boolean {
        return this.#device.isConnected();
    }

    get status() {
        return this.#status;
    }

    set status(value: any) {
        this.#status = Boolean(value);
    }

    async connect(): Promise<boolean> {
        try {
            await this.#device.find();
            await this.#device.connect();
            return true;
        } catch (error) {
            log.error({
                message: `Ошибка при подключении <${this.name}>: ${error}`,
                isTgSilent: true,
            });
            await this.reconnect();
            return false;
        }
    }

    // async disconnect(): Promise<boolean> {
    //     try {
    //         await this.#device.disconnect();
    //         return true;
    //     } catch (error) {
    //         log.error({
    //              message: `Ошибка при отключении <${this.name}>: ${error}`,
    //              isTgSilent: true,
    //         });
    //         return false;
    //     }
    // }

    async reconnect(): Promise<void> {
        if (this.#reconnection) {
            // log.silly(`Отмена повторного переподключения к <${this.name}>!`);
            return;
        }
        this.#reconnection = true;
        log.info(`Переподключение к <${this.name}>...`);

        let attemptCounter = 1;
        let timeoutSec = 5;
        const reconnectAttempt = () => {
            log.info(`Попытка подключения #${attemptCounter += 1} к <${this.name}> через ${timeoutSec} сек...`);
            setTimeout(async () => {
                const result = await this.connect();
                if (result) {
                    this.#reconnection = false;
                } else {
                    timeoutSec += attemptCounter % 5 ? 0 : 5;
                    reconnectAttempt();
                }
            }, timeoutSec * 1000);
        };
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
                default:
                    break;
            }
        } catch (error) {
            log.error({
                message: `Ошибка при переключении состояния <${this.name}>: ${error}`,
                isTgSilent: true,
            });
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
                default:
                    break;
            }
        } catch (error) {
            log.error({
                message: `Ошибка при включении <${this.name}>: ${error}`,
                isTgSilent: true,
            });
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
                default:
                    break;
            }
        } catch (error) {
            log.error({
                message: `Ошибка при выключении <${this.name}>: ${error}`,
                isTgSilent: true,
            });
        }
    }

    /**
     * Установить конфигурацию устройства
     * @param data
     */
    async dps(data) {
        if (data['21'] === 'scene') {
            await this.#device.set({
                multiple: true,
                data: {
                    21: 'scene',
                    25: data[25],
                },
            });

            return;
        }

        if (data['21'] === 'colour') {
            await this.#device.set({
                multiple: true,
                data: {
                    21: 'colour',
                    24: data[24],
                },
            });

            return;
        }

        if (data['21'] === 'white') {
            await this.#device.set({
                multiple: true,
                data: {
                    21: 'white',
                    22: data[22],
                    23: data[23],
                },
            });

            return;
        }

        await this.#device.set({
            multiple: true,
            data,
        });
    }

    /**
     * Получить конфигурацию устройства
     */
    async getDps() {
        return this.#device.get({schema: true});
    }

    /**
     * Установить RGB цвет свечения для устройства
     * @param {RGBColor} color
     */
    async rgb(color: RGBColor) {
        await this.dps(colorAdapter(color));
    }

    /**
     * Установить сцену (плавная смена цвета)
     * @param {SceneConfig} data
     */
    async scene(data: SceneConfig) {
        await this.dps(sceneAdapter(data));
    }

    /**
     * Запросить текущий статус устройства
     */
    async fetchCurrentStatus(): Promise<boolean | null> {
        try {
            switch (this.type) {
                case 'bulb': {
                    return Boolean(await this.#device.get({dps: 20}));
                }
                case 'plug': {
                    return Boolean(await this.#device.get({dps: 1}));
                }
                default:
                    return null;
            }
        } catch (error) {
            log.error({
                message: `Ошибка при получении статуса <${this.name}>: ${error}`,
                isTgSilent: true,
            });

            return null;
        }
    }
}
