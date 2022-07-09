interface LogHubOptions {
    length: number
}

export default class LogHub {
    history: Array<any>;
    length: number;
    private counter: number;

    constructor({length}: LogHubOptions) {
        this.length = length;
        this.history = [];
        this.counter = 0;
    }

    addLog(info) {
        if (this.history.length >= this.length) {
            this.history = this.history.slice(1, this.length);
        }

        const logItem = {
            ...info,
            hubId: this.counter,
        };

        this.counter += 1;
        this.history.push(logItem);
    }
}
