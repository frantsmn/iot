import WebSocketServer from 'ws'
import {spawn} from "child_process";

const wsServer = new WebSocketServer.Server({port: 9000});

wsServer.on('connection', onConnect);

// spawn new child process to call the python script
const python = spawn('python', ['sensor/sensor.py'])

// in close event we are sure that stream is from child process is closed
python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`)
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
