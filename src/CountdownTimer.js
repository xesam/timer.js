const IntervalTick = require('./IntervalTick');
const Ticker = require('./Ticker');

class CountdownTimer extends IntervalTick {
    constructor(duration, interval, handleEvent) {
        super(interval, handleEvent);
        this._left = this._duration = duration;
    };

    getInitialTicker() {
        return new Ticker((flyMills, ticker) => {
            const keepContinue = this.onTick(flyMills);
            this._left -= flyMills;
            if (this._left <= 0) {
                this.onEvent({type: 'finish', flyMills});
            } else {
                this.onEvent({type: 'tick', flyMills});
                if (keepContinue) {
                    const timeout = this._left < this._interval ? this._left : this._interval;
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
