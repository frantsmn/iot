import schedule from 'node-schedule';
import loggerCreator from '../logger';

const log = loggerCreator('PhoneScanner');

export default class PhoneScanner {
    constructor(userDeviceController) {
        // Искать устройства пользователя каждые 30 секунд
        schedule.scheduleJob('0/30 * * * * *', () => {
            userDeviceController
                .scanAll()
                .catch((error) => {
                    log.error({
                        message: `Ошибка при сканировании: ${error}`,
                        isTgSilent: true,
                    });
                });
        });
    }
}
