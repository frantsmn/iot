import os from 'os';
import fs from 'fs';
import { libcamera } from 'libcamera';
import loggerCreator from '../logger';

const log = loggerCreator('Camera');

export default class Camera {
    static async photoTimelapse() {
        const date = new Date();
        const dateMark = date.toLocaleDateString('ru-RU').replace(/\./g, '-');
        const timeMark = date.toLocaleTimeString('ru-RU').replace(/:/g, '-');
        const folderPath = `${os.homedir}/photo/${dateMark}`;

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        try {
            await libcamera.still({
                config: {
                    output: `${folderPath}/${timeMark}-%d.jpg`,
                    nopreview: true,
                    timelapse: 500,
                    timeout: 9000,
                    framestart: 1,
                    // quality: 80,
                }
            });
            log.info({
                message: `Фото сохранены [${folderPath}]`,
                isTg: true,
            });
        } catch (error) {
            log.error(error);
        }
    }
}