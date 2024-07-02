const IntervalTick = require('./IntervalTick');
const Ticker = require('./Ticker');

class Timer extends IntervalTick {
    constructor(interval = 1000, handleEvent) {
        super(interval, handleEvent);
    }

    getInitialTicker() {
        return new Ticker((flyMills, ticker) => {
            const keepContinue = this.onTick(flyMills);
            this.onEvent({ type: 'tick' });
            if (keepContinue) {
                ticker.start(this.getInterval());
            }
        });
    }
}

module.exports = Timer;
