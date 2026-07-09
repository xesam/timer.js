import mitt, { Emitter } from 'mitt';
import { Ticker } from './Ticker';

type IntervalTickEvents = {
    start?: void;
    stop?: void;
    pause?: void;
    resume?: void;
    tick?: any;
    done?: any;
};

export abstract class IntervalTick {
    protected _interval: number;
    protected _emitter: Emitter<IntervalTickEvents>;
    protected _ticker: Ticker;

    constructor(interval: number = 1000) {
        this._interval = interval;
        this._emitter = mitt<IntervalTickEvents>();
        this._ticker = this.getInitialTicker();
    }

    get interval(): number {
        return this._interval;
    }

    protected abstract getInitialTicker(): Ticker;

    protected _keepContinue_(_flyMills?: number): boolean {
        return true;
    }

    emit<Event extends keyof IntervalTickEvents>(event: Event, payload?: IntervalTickEvents[Event]): void {
        this._emitter.emit(event, payload);
    }

    on<Event extends keyof IntervalTickEvents>(event: Event, listener: (payload?: IntervalTickEvents[Event]) => void): void {
        this._emitter.on(event, listener);
    }

    start(): void {
        if (this._ticker.start(this._interval)) {
            this.emit('start');
        }
    }

    pause(): void {
        if (this._ticker.pause()) {
            this.emit('pause');
        }
    }

    resume(): void {
        if (this._ticker.resume()) {
            this.emit('resume');
        }
    }

    stop(): void {
        if (this._ticker.stop()) {
            this.emit('stop');
        }
    }
}