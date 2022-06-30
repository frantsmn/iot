import schedule from 'node-schedule';

export default class PhoneScanner {
    constructor(userDeviceController) {
        // Искать устройства пользователя каждые 30 секунд
        schedule.scheduleJob('0/30 * * * * *', () => {
            userDeviceController
                .scanAll()
                .catch((error) => {
                    // todo затащить логгер
                    console.log('Ошибка при поиске устройства пользователя');
                    console.error(error);
                });
        });
    }
}
