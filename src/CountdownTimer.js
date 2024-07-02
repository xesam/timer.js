const IntervalTick = require('./IntervalTick');
const Ticker = require('./Ticker');

class CountdownTimer extends IntervalTick {
    constructor(handleEvent, interval, duration) {
        super(handleEvent, interval);
        this._left = this._duration = duration;
    }

    getInitialTicker() {
        return new Ticker((flyMills, ticker) => {
            const keepContinue = this.onTick(flyMills);
            this._left -= flyMills;
            if (this._left <= 0) {
                this.emitEvent({ type: 'finish', flyMills });
            } else {
                this.emitEvent({ type: 'tick', flyMills });
                if (keepContinue) {
                    const interval = this.getInterval();
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
