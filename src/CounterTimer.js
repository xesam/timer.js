const Timer = require('./Timer');

class CounterTimer extends Timer {
    constructor(interval, eventHandler) {
        super(eventHandler);
        this.setInterval(interval);
        this._count = 0;
    }

    onEvent(event) {
        super.onEvent(event);
        if (event === 'tick') {
            this._count++;
        }
    }

    getCount() {
        return this._count;
    }
}

module.exports = CounterTimer;