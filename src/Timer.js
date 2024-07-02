const IntervalTick = require('./IntervalTick');
const Ticker = require('./Ticker');

class Timer extends IntervalTick {
    constructor(handleEvent, interval) {
        super(handleEvent, interval);
    }

    getInitialTicker() {
        return new Ticker((flyMills, ticker) => {
            this.emitEvent({ type: 'tick' });
            const keepContinue = this.onTick(flyMills);
            if (keepContinue) {
                ticker.start(this.getInterval());
            }
        });
    }
}

module.exports = Timer;
