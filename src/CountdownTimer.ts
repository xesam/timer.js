import mitt, { Emitter } from 'mitt';
import { Ticker } from './Ticker';
import { Timer } from './Timer';
import { TickEvent, TimerState, TimeSource } from './TimerTypes';

export type CountdownTickEvent = TickEvent & {
    remaining: number;
};

type CountdownEvents = {
    start?: void;
    pause?: void;
    resume?: void;
    stop?: void;
    reset?: void;
    tick?: CountdownTickEvent;
    done?: CountdownTickEvent;
};

type CountdownTimerOptions = {
    timeSource?: TimeSource;
};

export class CountdownTimer {
    private readonly core: Timer;
    // A second ticker tracks the overall duration deadline so `done` fires at the true
    // wall-clock end regardless of whether `interval` divides `duration` evenly. The core
    // ticker only fires at interval boundaries; without this, `done` would drift to the
    // next tick after duration expired. Pause/resume/stop/reset must be mirrored on both.
    private readonly completionTicker: Ticker;
    private readonly emitter: Emitter<CountdownEvents>;
    readonly interval: number;
    readonly duration: number;
    private currentRemaining: number;
    private lastProjectedElapsed = 0;

    constructor(interval: number, duration: number, options: CountdownTimerOptions = {}) {
        this.interval = interval;
        this.duration = duration;
        this.currentRemaining = duration;
        this.core = new Timer(interval, options);
        this.completionTicker = new Ticker(() => {
            this._emitDone(this.duration);
        }, options.timeSource);
        this.emitter = mitt<CountdownEvents>();

        this.core.on('start', () => {
            this.currentRemaining = this.duration;
            this.lastProjectedElapsed = 0;
            this.completionTicker.start(this.duration);
            this.emitter.emit('start');
        });
        this.core.on('pause', () => {
            this.currentRemaining = Math.max(this.duration - this.core.elapsed, 0);
            this.completionTicker.pause();
            this.emitter.emit('pause');
        });
        this.core.on('resume', () => {
            this.completionTicker.resume();
            this.emitter.emit('resume');
        });
        this.core.on('stop', () => {
            this.currentRemaining = Math.max(this.duration - this.core.elapsed, 0);
            this.completionTicker.stop();
            this.emitter.emit('stop');
        });
        this.core.on('reset', () => {
            this.completionTicker.reset();
            this.currentRemaining = this.duration;
            this.lastProjectedElapsed = 0;
            this.emitter.emit('reset');
        });
        this.core.on('tick', (payload) => {
            const tick = payload as TickEvent;
            this.currentRemaining = Math.max(this.duration - tick.elapsed, 0);
            this.lastProjectedElapsed = tick.elapsed;

            const event: CountdownTickEvent = {
                ...tick,
                remaining: this.currentRemaining
            };

            if (this.currentRemaining === 0) {
                this.completionTicker.stop();
                this.core.stop();
                this.emitter.emit('done', event);
                return;
            }

            this.emitter.emit('tick', event);
        });
    }

    get remaining(): number {
        return this.currentRemaining;
    }

    get elapsed(): number {
        return this.core.elapsed;
    }

    getDuration(): number {
        return this.duration;
    }

    get state(): TimerState {
        return this.core.state;
    }

    on<Event extends keyof CountdownEvents>(event: Event, listener: (payload?: CountdownEvents[Event]) => void): void {
        this.emitter.on(event, listener);
    }

    start(): void {
        this.core.start();
    }

    pause(): void {
        this.core.pause();
    }

    resume(): void {
        this.core.resume();
    }

    stop(): void {
        this.core.stop();
    }

    reset(): void {
        this.core.reset();
    }

    private _emitDone(elapsed: number): void {
        if (this.currentRemaining === 0 && this.core.state === 'idle') {
            return;
        }

        const boundedElapsed = Math.min(elapsed, this.duration);
        const delta = boundedElapsed - this.lastProjectedElapsed;
        this.currentRemaining = 0;
        this.lastProjectedElapsed = boundedElapsed;
        this.core.stop();
        this.emitter.emit('done', {
            elapsed: boundedElapsed,
            delta,
            remaining: 0
        });
    }
}
