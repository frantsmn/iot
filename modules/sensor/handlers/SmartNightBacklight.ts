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
        if (!this.dps || !this.dps?.dps || this.dps.dps[21] !== 'colour') {
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

        this.timeout = setTimeout(() => {
            if (this.dps) {
                console.log('[SmartNightBacklight] > Возврат пред. конфигурации', this.dps.dps);

                tuyaDeviceController.action('top', 'dps', this.dps.dps);
                this.dps = null;
            }
        }, 30000);
    }
}
