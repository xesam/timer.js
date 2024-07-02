const Timer = require('./Timer');

class CounterTimer extends Timer {
    constructor(interval, maxCount = Number.MAX_VALUE) {
        super(({ type }) => {
            if (type === 'tick') {
                this._count++;
            }
        }, interval);
        this._count = 0;
        this._maxCount = maxCount;
    }

    onTick() {
        return this._count < this._maxCount;
    }

    getCount() {
        return this._count;
    }
}

module.exports = CounterTimer;
