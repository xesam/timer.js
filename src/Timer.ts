import { Emitter } from 'mitt';
import { IntervalTick } from './IntervalTick';
import { Ticker } from './Ticker';
import { SystemTimeSource, TickEvent, TimerEvents, TimerState, TimeSource } from './TimerTypes';

type TimerOptions = {
    timeSource?: TimeSource;
};

export class Timer extends IntervalTick {
    protected _state: TimerState = 'idle';
    protected _elapsed = 0;
    private _timeSource?: TimeSource;

    constructor(interval: number = 1000, options: TimerOptions = {}) {
        super(interval);
        this._timeSource = options.timeSource ?? new SystemTimeSource();
    }

    get state(): TimerState {
        return this._state;
    }

    get elapsed(): number {
        return this._elapsed + this._ticker.getSegmentElapsed();
    }

    protected getInitialTicker(): Ticker {
        const fallbackTimeSource = new SystemTimeSource();
        const delegatedTimeSource: TimeSource = {
            now: () => (this._timeSource ?? fallbackTimeSource).now()
        };

        return new Ticker(
            (flyMills: number, ticker: Ticker) => {
                this._elapsed += flyMills;
                this.emit('tick', {
                    elapsed: this._elapsed,
                    delta: flyMills
                } as TickEvent);

                if (this._state !== 'running') {
                    return;
                }

                if (this._keepContinue_(flyMills)) {
                    ticker.start(this.interval);
                    return;
                }

                this._state = 'idle';
                this.emit('done');
            },
            delegatedTimeSource
        );
    }

    protected _reset_(): void {}

    protected get _timerEmitter(): Emitter<TimerEvents> {
        return this._emitter as unknown as Emitter<TimerEvents>;
    }

    emit<Event extends keyof TimerEvents>(event: Event, payload?: TimerEvents[Event]): void {
        this._timerEmitter.emit(event, payload);
    }

    on<Event extends keyof TimerEvents>(event: Event, listener: (payload?: TimerEvents[Event]) => void): void {
        this._timerEmitter.on(event, listener);
    }

    start(): void {
        if (this._state !== 'idle') {
            return;
        }
        this._elapsed = 0;
        if (this._ticker.start(this.interval)) {
            this._state = 'running';
            this.emit('start');
        }
    }

    pause(): void {
        if (this._ticker.pause()) {
            this._state = 'paused';
            this.emit('pause');
        }
    }

    resume(): void {
        if (this._ticker.resume()) {
            this._state = 'running';
            this.emit('resume');
        }
    }

    stop(): void {
        if (this._ticker.stop()) {
            this._state = 'idle';
            this.emit('stop');
        }
    }

    reset(): void {
        this._ticker.reset();
        this._elapsed = 0;
        this._state = 'idle';
        this._reset_();
        this.emit('reset');
    }
}
