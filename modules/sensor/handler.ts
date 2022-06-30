import throttle from 'lodash.throttle'
import tuyaDeviceController from "../tuya";

const throttledHandleMessage = throttle((rawMessage, callback) => callback(rawMessage), 3000, {'trailing': false});

let timeout: NodeJS.Timeout = null;
let dps: any = null;

async function handleMessage(rawMessage) {
    const message = rawMessage.toString('utf8');
    const timestamp = parseInt(String(parseFloat(message) * 1000));
    console.log('[handle message]', timestamp);

    // Читать текущий конфиг лампочки
    dps = !dps ? await tuyaDeviceController.getDeviceDps('top') : dps;
    console.log('[dps top] >', dps?.dps);

    await tuyaDeviceController.action('top', 'dps', {
        "21": "white",
        "22": 500,
        "23": 0
    });

    if (timeout) {
        clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
        if (dps) {
            console.log('[Попытка вернуть конфиг]', dps.dps);
            tuyaDeviceController.action('top', 'dps', dps.dps);
            dps = null;
        }
    }, 6000);
}

export default function onMessage(rawMessage) {
    throttledHandleMessage(rawMessage, handleMessage);
}
