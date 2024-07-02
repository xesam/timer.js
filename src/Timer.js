const IntervalTick = require('./IntervalTick');
const Ticker = require('./Ticker');

class Timer extends IntervalTick {
    constructor(interval) {
        super(interval);
    }

    getInitialTicker() {
        return new Ticker((flyMills, ticker) => {
            this.emit('tick');
            if (this._keepContinue_(flyMills)) {
                ticker.start(this.interval);
            }
        });
    }
}

module.exports = Timer;
