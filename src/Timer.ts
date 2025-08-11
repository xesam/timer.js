import { IntervalTick } from './IntervalTick';
import { Ticker } from './Ticker';

export class Timer extends IntervalTick {
    constructor(interval: number) {
        super(interval);
    }

    protected getInitialTicker(): Ticker {
        return new Ticker((flyMills: number, ticker: Ticker) => {
            this.emit('tick');
            if (this._keepContinue_(flyMills)) {
                ticker.start(this.interval);
            } else {
                this.emit('done');
            }
        });
    }
}