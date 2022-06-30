import WebSocketServer from 'ws'
import {PythonShell} from 'python-shell';
import onMessage from "./handler";

const wsServer = new WebSocketServer.Server({port: 9000});
wsServer.on('connection', (client) => {
    console.log('New connection...', client);

    client.send('connected');

    client.on('message', function (message) {
        onMessage(message);
    });

    client.on('close', function () {
        console.log('Connection closed!');
    });
});

if (process.platform !== "linux") {
    console.warn('[SensorHandler] Not a linux platform!')
} else {
    PythonShell.run('/home/pi/dev/iot/websocket/sensor/sensor.py', null, function (err) {
        if (err) throw err;
        console.error('[sensor.py] Finished with error:', err);
    });
}
