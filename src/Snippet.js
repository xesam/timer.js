const NOP = () => {
    console.log('tick timeout');
};

class Snippet {
    constructor(onTimeout = NOP) {
        this._timerFlag = null;
        this._flyMills = 0;
        this._onTimeout = onTimeout;
        this._startMills = Number.MAX_VALUE;
    }

    getElapsed() {
        return Date.now();
    }

    tick(timeout) {
        clearTimeout(this._timerFlag);
        this._startMills = this.getElapsed();
        this._timerFlag = setTimeout(() => {
            this._flyMills += this.getElapsed() - this._startMills;
            this._onTimeout(this._flyMills);
        }, timeout);
        return true;
    }

    interrupt() {
        clearTimeout(this._timerFlag);
        this._flyMills += this.getElapsed() - this._startMills;
        return true;
    }
}

exports.Tick = Snippet;
