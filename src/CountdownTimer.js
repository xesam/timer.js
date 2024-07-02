const IntervalTick = require('./IntervalTick');
const Ticker = require('./Ticker');

class CountdownTimer extends IntervalTick {
    constructor(interval, duration) {
        super(interval);
        this._left = this._duration = duration;
    }

    getInitialTicker() {
        return new Ticker((flyMills, ticker) => {
            this._left -= flyMills;
            if (this._left <= 0) {
                this.emit('done', { flyMills });
            } else {
                this.emit('tick', { flyMills });
                if (this._keepContinue_(flyMills)) {
                    const interval = this.interval;
                    const timeout = this._left < interval ? this._left : interval;
                    ticker.start(timeout);
                }
            }
        });
    }

    getDuration() {
        return this._duration;
    }
}

module.exports = CountdownTimer;
