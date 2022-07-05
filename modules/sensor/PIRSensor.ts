import {Server} from 'ws';
import {PythonShell} from 'python-shell';
import {EventEmitter} from 'events';
import throttle from 'lodash.throttle';

export default class PIRSensor {
    private eventEmitter: EventEmitter;
    private wsServer: Server;
    private readonly throttledMessageEmitter: throttle;
    #isConnected = false;

    constructor({port, throttleTimeout}: { port: number, throttleTimeout: number }) {
        this.wsServer = new Server({port});
        this.eventEmitter = new EventEmitter();
        this.throttledMessageEmitter = throttle((message) => this.eventEmitter.emit('message', {
            timestamp: Date.now(),
            message: message.toString(),
        }), throttleTimeout, {trailing: false});

        this.wsServer.on('connection', (client) => {
            this.#isConnected = true;

            this.eventEmitter.emit('connect', {
                timestamp: Date.now(),
            });

            client.on('message', (message) => this.throttledMessageEmitter(message));

            client.on('close', () => {
                this.#isConnected = false;

                this.eventEmitter.emit('close', {
                    timestamp: Date.now(),
                });
            });
        });

        if (process.platform === 'linux') {
            PythonShell.run('/home/pi/dev/iot/modules/sensor/python/sensor.py', null, (err) => {
                if (err) throw err;
                console.error('[sensor.py] Finished with error:', err);
            });
        } else {
            console.warn('[PIRSensor] Not a linux platform! PIRSensor will not work!');
        }
    }

    /**
     * Статус подключения датчика
     * @returns {Boolean} is sensor connected to wsServer
     */
    get isConnected() {
        return this.#isConnected;
    }

    /**
     * Добавить обработчик события
     * @param eventName
     * @param handler
     */
    on(eventName: 'connect' | 'message' | 'close', handler: (...args: any[]) => void) {
        this.eventEmitter.on(eventName, handler);
    }

    /**
     * Убрать обработчик события
     * @param eventName
     * @param handler
     */
    off(eventName: 'connect' | 'message' | 'close', handler: (...args: any[]) => void) {
        this.eventEmitter.off(eventName, handler);
    }
}
