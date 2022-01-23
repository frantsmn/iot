import schedule from 'node-schedule'
import {tuyaDeviceController} from "../controller";
import {userDeviceController} from "../controller";
import loggerCreator from "../logger"

const log = loggerCreator('light-scheduler');

export default class LightSchedule {
    constructor() {
        // Включать люстру в 07:55 если к WiFi подключен телефон
        schedule.scheduleJob(
            {hour: 7, minute: 55, dayOfWeek: [1, 2, 3, 4, 5]},
            async () => {
                if (userDeviceController.isAnyDeviceConnected) {
                    log.info('Включение <top> по расписанию');
                    await tuyaDeviceController.action('top', 'on');
                }
            }
        );
        // Включать подсветку в 08:10 если к WiFi подключен телефон
        schedule.scheduleJob(
            {hour: 8, minute: 10, dayOfWeek: [1, 2, 3, 4, 5]},
            async () => {
                if (userDeviceController.isAnyDeviceConnected) {
                    log.info('Включение <ambient> по расписанию');
                    await tuyaDeviceController.action('ambient', 'on');
                }
            }
        );

        // Выключать весь свет в 09:30 (если к WiFi не подключен телефон)
        schedule.scheduleJob(
            {hour: 9, minute: 30},
            async () => {
                if (userDeviceController.isAnyDeviceConnected === false) {
                    log.info('Выключение <all> по расписанию');
                    await tuyaDeviceController.action('all', 'off');
                }
            }
        );
        // Выключать весь свет в 01:00
        schedule.scheduleJob(
            {hour: 1, minute: 0},
            async () => {
                log.info('Выключение <all> по расписанию');
                await tuyaDeviceController.action('all', 'off')
            }
        );
    }
}
