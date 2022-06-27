import WebSocketServer from 'ws'
import {PythonShell} from 'python-shell';

const wsServer = new WebSocketServer.Server({port: 9000});
wsServer.on('connection', onConnect);

PythonShell.run('sensor/sensor.py', null, function (err) {
    if (err) throw err;
    console.log('finished with error', err);
});

function onConnect(client) {
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
}
