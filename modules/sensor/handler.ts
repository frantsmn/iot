import throttle from 'lodash.throttle';
import tuyaDeviceController from '../tuya';

let timeout: NodeJS.Timeout = null;
let dps: any = null;

async function handleMessage(rawMessage) {
    const message = rawMessage.toString();
    const timestamp = parseInt(String(parseFloat(message) * 1000), 10);

    // Читать текущий конфиг лампочки
    dps = !dps ? await tuyaDeviceController.getDeviceDps('top') : dps;
    console.log('[Сохранение конфигурации]', timestamp, dps?.dps);

    await tuyaDeviceController.action('top', 'rgb', {
        r: 255,
        g: 255,
        b: 255,
    });

    if (timeout) {
        clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
        if (dps) {
            console.log('[Возврат пред. конфигурации]', dps.dps);
            tuyaDeviceController.action('top', 'dps', dps.dps);
            dps = null;
        }
    }, 10000);
}

export default throttle(handleMessage, 3000, {trailing: false});
