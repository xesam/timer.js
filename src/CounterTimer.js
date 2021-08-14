const Timer = require('./Timer');

class CounterTimer extends Timer {
    constructor(interval, handleEvent, maxCount = Number.MAX_VALUE) {
        super(interval, handleEvent);
        this._count = 0;
        this.maxCount = maxCount;
    }

    onTick() {
        this._count++;
        return this._count < this.maxCount;
    }

    getCount() {
        return this._count;
    }
}

module.exports = CounterTimer;