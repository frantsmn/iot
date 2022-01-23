interface LogHubOptions {
    length: number
}

export default class LogHub {
    history: Array<any>
    length: number
    private counter: number

    constructor({length}: LogHubOptions) {
        this.length = length;
        this.history = Array();
        this.counter = 0;
    }

    addLog(info) {
        if (this.history.length >= this.length) {
            this.history = this.history.slice(1, this.length);
        }

        info.hubId = this.counter;
        this.counter++;
        this.history.push(info);
    }
}
