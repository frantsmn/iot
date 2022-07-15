import Camera from "../../camera/Camera";
import type PIRSensor from '../PIRSensor';
import userDevicesController from "../../userDevice";
import loggerCreator from "../../logger";

const log = loggerCreator('SurveillanceCamera');

/**
 * SurveillanceCamera (Камера слежения)
 * Делает серию снимков если обнаружено движение
 */

export default class SurveillanceCamera {
    constructor(pirSensor: PIRSensor) {
        pirSensor.on('connect', () => log.info('Подключено к PIR Sensor'));
        pirSensor.on('message', this.handleMessage, {
            throttleTimeout: 10000,
            trailing: true,
        });
    }

    handleMessage() {
        if (userDevicesController.isAnyDeviceConnected) {
            return;
        }

        log.info({
            message: 'Старт съемки...',
            isTg: true,
            isTgSilent: false,
        });

        Camera.photoTimelapse();
    }
}