import schedule from 'node-schedule'
import {userDeviceController} from "../controller";

export default class UserDeviceSchedule {
    constructor() {
        // Пытаться найти устройства пользователя каждые 30 секунд
        schedule.scheduleJob(
            '0/30 * * * * *',
            () => userDeviceController.scanAll()
                .catch((error) => {
                    console.log('Ошибка при попытке поиска устройства пользователя');
                    console.error(error);
                })
        );
    }
}
