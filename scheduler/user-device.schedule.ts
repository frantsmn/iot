import schedule from 'node-schedule'
import {userDeviceController} from "../controller";

export default class UserDeviceSchedule {
    constructor() {
        // Пытаться найти устройства пользователя каждые 15 секунд
        schedule.scheduleJob(
            '0/15 * * * * *',
            () => userDeviceController.scanAll()
                .catch((error) => {
                    console.log('Ошибка при попытке поиска устройства пользователя');
                    console.error(error);
                })
        );
    }
}
