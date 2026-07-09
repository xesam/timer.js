import mitt, { Emitter } from 'mitt';
import { Timer } from './Timer';
import { TickEvent, TimerState, TimeSource } from './TimerTypes';

export type EmitterDataEvent<T> = TickEvent & {
    data: T;
    index: number;
};

type EmitterEvents<T> = {
    start?: void;
    pause?: void;
    resume?: void;
    stop?: void;
    reset?: void;
    data?: EmitterDataEvent<T>;
    done?: EmitterDataEvent<T>;
};

type EmitterTimerOptions = {
    timeSource?: TimeSource;
};

export class EmitterTimer<T = unknown> {
    private readonly core: Timer;
    private readonly emitter: Emitter<EmitterEvents<T>>;
    private currentIndex = 0;
    private readonly interval: number;

    constructor(private readonly dataSource: T[], interval: number, options: EmitterTimerOptions = {}) {
        this.interval = interval;
        this.core = new Timer(interval, options);
        this.emitter = mitt<EmitterEvents<T>>();

        this.core.on('start', () => {
            this.currentIndex = 0;
            this.emitter.emit('start');
        });
        this.core.on('pause', () => this.emitter.emit('pause'));
        this.core.on('resume', () => this.emitter.emit('resume'));
        this.core.on('stop', () => this.emitter.emit('stop'));
        this.core.on('reset', () => {
            this.currentIndex = 0;
            this.emitter.emit('reset');
        });
        this.core.on('tick', (payload) => {
            const tick = payload as TickEvent;
            const projectedIndex = Math.max(Math.min(Math.floor(tick.elapsed / this.interval) - 1, this.dataSource.length - 1), 0);
            const event: EmitterDataEvent<T> = {
                ...tick,
                data: this.dataSource[projectedIndex],
                index: projectedIndex
            };

            this.currentIndex = projectedIndex;
            this.emitter.emit('data', event);

            if (projectedIndex >= this.dataSource.length - 1) {
                this.core.stop();
                this.emitter.emit('done', event);
            }
        });
    }

    get index(): number {
        return this.currentIndex;
    }

    get elapsed(): number {
        return this.core.elapsed;
    }

    getIndex(): number {
        return this.currentIndex;
    }

    get state(): TimerState {
        return this.core.state;
    }

    on<Event extends keyof EmitterEvents<T>>(event: Event, listener: (payload?: EmitterEvents<T>[Event]) => void): void {
        this.emitter.on(event, listener);
    }

    start(): void {
        if (this.dataSource.length === 0) {
            this.currentIndex = 0;
            this.emitter.emit('start');
            this.emitter.emit('done', {
                elapsed: 0,
                delta: 0,
                data: undefined as T,
                index: 0
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
