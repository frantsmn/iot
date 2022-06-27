import WebSocketServer from 'ws'
import {PythonShell} from 'python-shell';

const wsServer = new WebSocketServer.Server({port: 9000});
wsServer.on('connection', (client) => {
    console.log('New connection...', client);

    client.send('connected');

    client.on('message', function (message) {
        const m = message.toString('utf8');
        const timestamp = parseInt(String(parseFloat(m) * 1000));

        console.log(">", m, new Date(timestamp));
    });

    client.on('close', function () {
        console.log('Connection closed!');
    });
});

PythonShell.run('websocket/sensor/sensor.py', null, function (err) {
    if (err) throw err;
    console.error('[sensor.py] Finished with error:', err);
});
