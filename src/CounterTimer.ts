import mitt, { Emitter } from 'mitt';
import { Timer } from './Timer';
import { TickEvent, TimerState, TimeSource } from './TimerTypes';

export type CounterTickEvent = TickEvent & {
    count: number;
};

type CounterEvents = {
    start?: void;
    pause?: void;
    resume?: void;
    stop?: void;
    reset?: void;
    tick?: CounterTickEvent;
    done?: CounterTickEvent;
};

type CounterTimerOptions = {
    timeSource?: TimeSource;
};

export class CounterTimer {
    private readonly core: Timer;
    private readonly emitter: Emitter<CounterEvents>;
    private currentCount = 0;
    readonly interval: number;

    constructor(interval: number, private readonly maxCount: number = Number.MAX_VALUE, options: CounterTimerOptions = {}) {
        this.interval = interval;
        this.core = new Timer(interval, options);
        this.emitter = mitt<CounterEvents>();

        this.core.on('start', () => {
            this.currentCount = 0;
            this.emitter.emit('start');
        });
        this.core.on('pause', () => this.emitter.emit('pause'));
        this.core.on('resume', () => this.emitter.emit('resume'));
        this.core.on('stop', () => this.emitter.emit('stop'));
        this.core.on('reset', () => {
            this.currentCount = 0;
            this.emitter.emit('reset');
        });
        this.core.on('tick', (payload) => {
            const tick = payload as TickEvent;
            this.currentCount = Math.min(Math.floor(tick.elapsed / this.interval), this.maxCount);

            const event: CounterTickEvent = {
                ...tick,
                count: this.currentCount
            };

            if (this.currentCount >= this.maxCount) {
                this.core.stop();
                this.emitter.emit('done', event);
                return;
            }

            this.emitter.emit('tick', event);
        });
    }

    get count(): number {
        return this.currentCount;
    }

    get elapsed(): number {
        return this.core.elapsed;
    }

    getCount(): number {
        return this.currentCount;
    }

    get state(): TimerState {
        return this.core.state;
    }

    on<Event extends keyof CounterEvents>(event: Event, listener: (payload?: CounterEvents[Event]) => void): void {
        this.emitter.on(event, listener);
    }

    start(): void {
        if (this.maxCount <= 0) {
            this.currentCount = 0;
            this.emitter.emit('start');
            this.emitter.emit('done', {
                elapsed: 0,
                delta: 0,
                count: 0
            });
            return;
        }

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
}
