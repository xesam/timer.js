const IntervalTick = require('./IntervalTick');
const Ticker = require('./Ticker');

class Timer extends IntervalTick {
    constructor(interval) {
        super(interval);
    }

    getInitialTicker() {
        return new Ticker((flyMills, ticker) => {
            this.emit('tick');
            const keepContinue = this._onTick_(flyMills);
            if (keepContinue) {
                ticker.start(this.interval);
            }
        });
    }
}

module.exports = Timer;
