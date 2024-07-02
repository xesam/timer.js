const IntervalTick = require('./IntervalTick');
const Ticker = require('./Ticker');

class Timer extends IntervalTick {
    constructor(interval = 1000, handleEvent) {
        super(interval, handleEvent);
    }

    getInitialTicker() {
        return new Ticker((flyMills, ticker) => {
            this.onEvent({ type: 'tick' });
            const keepContinue = this.onTick(flyMills);
            if (keepContinue) {
                ticker.start(this.getInterval());
            }
        });
    }
}

module.exports = Timer;
