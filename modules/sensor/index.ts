import WebSocketServer from 'ws';
import {PythonShell} from 'python-shell';
import onMessage from './handler';

const wsServer = new WebSocketServer.Server({port: 9000});
wsServer.on('connection', (client) => {
    console.log('New connection...');

    client.send('connected');

    client.on('message', (message) => {
        onMessage(message);
    });

    client.on('close', () => {
        console.log('Connection closed!');
    });
});

if (process.platform !== 'linux') {
    console.warn('[SensorHandler] Not a linux platform!');
} else {
    PythonShell.run('/home/pi/dev/iot/modules/sensor/python/sensor.py', null, (err) => {
        if (err) throw err;
        console.error('[sensor.py] Finished with error:', err);
    });
}
