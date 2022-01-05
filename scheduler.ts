import schedule from 'node-schedule'
import tuyaController from './tuya.controller'

export default class Scheduler {
    constructor() {
        // Пытаться включить свет каждую минуту от 17:00 до 21:59
        // TODO (если тел дома)
        // schedule.scheduleJob(
        // '*/1 17-21 * * *',
        // tuyaController.action('ambient', 'on'));

        // Пытаться включить свет
        // каждую минуту от 07:50 до 07:59 c понедельника по пятницу
        // TODO (если тел дома)
        schedule.scheduleJob(
            '55-59/1 7 * * 1-5',
            () => tuyaController.action('ambient', 'on')
        );

        // Пытаться включить свет
        // каждую минуту от 08:00 до 08:05 c понедельника по пятницу
        // TODO (если тел дома)
        schedule.scheduleJob(
            '0-5/1 8 * * 1-5',
            () => tuyaController.action('ambient', 'on')
        );

        // Выключать свет
        schedule.scheduleJob(
            {hour: 1, minute: 0},
            () => tuyaController.action('all', 'off')
        );
        schedule.scheduleJob(
            {hour: 9, minute: 30},
            () => tuyaController.action('all', 'off')
        );
    }
}
