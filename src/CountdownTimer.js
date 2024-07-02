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
            const leftMills = this._left;
            if (this._left <= 0) {
                this.emit('done', { leftMills });
            } else {
                this.emit('tick', { leftMills });
                if (this._keepContinue_(flyMills)) {
                    const interval = this.interval;
                    const timeout = leftMills < interval ? leftMills : interval;
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
