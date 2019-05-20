const BaseTimer = require('./BaseTimer');

class CounterTimer extends BaseTimer {
    constructor(interval, options = {}) {
        super(options);
        this.setInterval(interval);
        this._counter = 0;
    }

    _onTimeout(time) {
        this._counter++;
    }

    getTickInfo() {
        return this._counter;
    }
}

module.exports = CounterTimer;
