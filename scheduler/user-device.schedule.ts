import schedule from 'node-schedule'
import {userDeviceController} from "../controller";

export default class UserDeviceSchedule {
    constructor() {
        // Искать устройства пользователя каждые 30 секунд
        schedule.scheduleJob('0/30 * * * * *', () => {
            userDeviceController
                .scanAll()
                .catch((error) => {
                    // todo затащить логгер
                    console.log('Ошибка при поиске устройства пользователя');
                    console.error(error);
                })
        });
    }
}
