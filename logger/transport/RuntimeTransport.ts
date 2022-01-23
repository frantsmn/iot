import Transport from 'winston-transport';
import LogHub from "./LogHub";

export default class RuntimeTransport extends Transport {
    hub: LogHub

    constructor(opts) {
        super(opts);
        this.hub = opts.hub;
    }

    log(info, callback) {
        this.hub.addLog(info)
        callback();
    }
}
