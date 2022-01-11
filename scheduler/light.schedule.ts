import schedule from 'node-schedule'
import {tuyaDeviceController} from "../controller";
import {userDeviceController} from "../controller";

export default class LightSchedule {
    constructor() {
        // Пытаться включить подсветку каждую минуту
        // с 07:50 до 07:59 c понедельника по пятницу
        schedule.scheduleJob(
            '50-59/1 7 * * 1-5',
            () => {
                // если хоть одно устройство пользователя
                // подкл. к локальной сети (актуально)
                if (userDeviceController.isAnyDeviceActualNow()) {
                    tuyaDeviceController.action('ambient', 'on')
                }
            }
        );
        // Пытаться включить лампочку каждую минуту
        // с 08:00 до 08:05 c понедельника по пятницу
        schedule.scheduleJob(
            '0-5/1 8 * * 1-5',
            () => {
                // если хоть одно устройство пользователя
                // подкл. к локальной сети (актуально)
                if (userDeviceController.isAnyDeviceActualNow()) {
                    tuyaDeviceController.action('top', 'on')
                }
            }
        );

        // Выключить свет
        // в 01:00
        schedule.scheduleJob(
            {hour: 1, minute: 0},
            () => tuyaDeviceController.action('all', 'off')
        );
        // Выключить свет
        // в 09:30
        schedule.scheduleJob(
            {hour: 9, minute: 30},
            () => tuyaDeviceController.action('all', 'off')
        );
    }
}
