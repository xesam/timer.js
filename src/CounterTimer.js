const Timer = require('./Timer');

class CounterTimer extends Timer {
    constructor(interval) {
        super();
        this.setInterval(interval);
        this._count = 0;
    }

    onTick() {
        console.log('tick tick')
        this._count++;
        console.log(this._count)
    }

    getCount() {
        return this._count;
    }
}

module.exports = CounterTimer;