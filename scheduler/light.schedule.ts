import schedule from 'node-schedule'
import {tuyaDeviceController} from "../controller";
import {userDeviceController} from "../controller";

export default class LightSchedule {
    constructor() {
        // Включать подсветку в 07:55 если к WiFi подключен телефон
        schedule.scheduleJob(
            {hour: 7, minute: 55},
            async () => {
                if (userDeviceController.isAnyDeviceConnected()) {
                    await tuyaDeviceController.action('ambient', 'on');
                }
            }
        );
        // Включать люстру в 08:10 если к WiFi подключен телефон
        schedule.scheduleJob(
            {hour: 8, minute: 10},
            async () => {
                if (userDeviceController.isAnyDeviceConnected()) {
                    await tuyaDeviceController.action('top', 'on');
                }
            }
        );

        // Выключать весь свет в 01:00
        schedule.scheduleJob(
            {hour: 1, minute: 0},
            () => tuyaDeviceController.action('all', 'off')
        );
        // Выключать весь свет в 09:30
        schedule.scheduleJob(
            {hour: 9, minute: 30},
            () => tuyaDeviceController.action('all', 'off')
        );
    }
}
