const IntervalTick = require('./IntervalTick');
const Ticker = require('./Ticker');

class Timer extends IntervalTick {
    constructor(handleEvent, interval) {
        super(handleEvent, interval);
    }

    getInitialTicker() {
        return new Ticker((flyMills, ticker) => {
            this.emit({ type: 'tick' });
            const keepContinue = this._onTick_(flyMills);
            if (keepContinue) {
                ticker.start(this.getInterval());
            }
        });
    }
}

module.exports = Timer;
