import tuyaDeviceController from '../../tuya';
import type PIRSensor from '../PIRSensor';

/**
 * SmartNightBacklight (Умная ночная подсветка)
 * Делает ночное освещение ярче при обнаружении движения в комнате
 */

export default class SmartNightBacklight {
    timeout: NodeJS.Timeout;
    private dps: any;

    constructor(pirSensor: PIRSensor) {
        pirSensor.on('connect', () => console.log('[SmartNightBacklight] > Подключен'));
        pirSensor.on('message', this.handleMessage);
        this.timeout = null;
        this.dps = null;
    }

    async handleMessage({message}) {
        // Читать текущий конфиг лампочки
        this.dps = !this.dps ? await tuyaDeviceController.getDeviceDps('top') : this.dps;
        // Валидация конфига
        if (!this.dps || !this.dps?.dps || this.dps.dps[21] === 'white') {
            this.dps = null;

            return;
        }

        const timestamp = parseInt(String(parseFloat(message) * 1000), 10);
        console.log('[SmartNightBacklight] > Сохранение конфигурации', timestamp, this.dps?.dps);

        await tuyaDeviceController.action('top', 'rgb', {
            r: 255,
            g: 255,
            b: 255,
        });

        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        this.timeout = setTimeout(async () => {
            const currentDps = await tuyaDeviceController.getDeviceDps('top');

            // Если по прежнему стоит цвет умной подсветки (не сменили режим)
            if (this.dps && currentDps?.dps[21] === 'colour' && currentDps?.dps[24] === '0000000003e8') {
                console.log('[SmartNightBacklight] > Возврат конфигурации', this.dps.dps);

                tuyaDeviceController.action('top', 'dps', this.dps.dps);
            } else {
                console.log('[SmartNightBacklight] > Возврат конфигурации отменен. Режим был изменен');
            }

            this.dps = null;
        }, 30000);
    }
}
