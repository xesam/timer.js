const BaseTimer = require('./BaseTimer');

class CounterTimer extends BaseTimer {
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