import PIRSensor from './PIRSensor';
import SmartNightBacklight from './handlers/SmartNightBacklight';

const pirSensor = new PIRSensor({
    port: 9000,
    throttleTimeout: 3000,
});

// eslint-disable-next-line import/prefer-default-export
export const smartNightBacklight = new SmartNightBacklight(pirSensor);
