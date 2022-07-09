import http from 'http';
import WinstonTransport from 'winston-transport';

interface LogItem {
    level: 'silly' | 'info' | 'warn' | 'error',
    message: String, // Сообщение
    service?: String, // Название сервиса (iot)
    label?: String, // Название модуля (tuya)
    isTg?: Boolean, // Прислать ботом в телеграмме
    isTgSilent?: Boolean // Беззвучное оповещение в телеграмме
}

export default class TelegramBotTransport extends WinstonTransport {
    private readonly options: object;
    private readonly label: string;

    constructor(opts) {
        super(opts);
        this.options = {
            hostname: 'localhost',
            port: 3030,
            path: '/log',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        this.label = opts.label;
    }

    log(logItem: LogItem, callback) {
        const postData = JSON.stringify({
            ...logItem,
            label: this.label,
            service: 'iot',
        });
        const options: any = {
            ...this.options,
            'Content-Length': Buffer.byteLength(postData).toString(),
        };
        const req = http.request(options);

        req.on('error', (error) => {
            console.error('[TelegramBotTransport]', error);
        });
        req.write(postData);
        req.end();
        callback();
    }
}
