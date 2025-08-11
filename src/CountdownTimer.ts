import { IntervalTick } from './IntervalTick';
import { Ticker } from './Ticker';

interface CountdownTickPayload {
    leftMills: number;
}

interface DonePayload {
    leftMills: number;
}

export class CountdownTimer extends IntervalTick {
    private _left: number;
    private _duration: number;

    constructor(interval: number, duration: number) {
        super(interval);
        this._left = this._duration = duration;
    }

    protected getInitialTicker(): Ticker {
        return new Ticker((flyMills: number, ticker: Ticker) => {
            this._left -= flyMills;
            const leftMills = this._left;
            if (this._left <= 0) {
                this.emit('done', { leftMills } as DonePayload);
            } else {
                this.emit('tick', { leftMills } as CountdownTickPayload);
                if (this._keepContinue_(flyMills)) {
                    const interval = this.interval;
                    const timeout = leftMills < interval ? leftMills : interval;
                    ticker.start(timeout);
                }
            }
        });
    }

    getDuration(): number {
        return this._duration;
    }
}