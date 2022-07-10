import PIRSensor from './PIRSensor';
import SmartNightBacklight from './handlers/SmartNightBacklight';
import SurveillanceCamera from './handlers/SurveillanceCamera';

const pirSensor = new PIRSensor({ port: 9000 });

export const surveillanceCamera = new SurveillanceCamera(pirSensor);
export const smartNightBacklight = new SmartNightBacklight(pirSensor);
