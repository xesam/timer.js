const Timer = require('./Timer');

class CounterTimer extends Timer {
    constructor(interval, maxCount = Number.MAX_VALUE) {
        super(interval);
        this._count = 0;
        this._maxCount = maxCount;
        this.on('tick', () => {
            this._count++;
        });
    }

    _keepContinue_() {
        return this._count < this._maxCount;
    }

    getCount() {
        return this._count;
    }
}

module.exports = CounterTimer;
