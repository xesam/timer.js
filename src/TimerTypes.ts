export type TimerState = 'idle' | 'running' | 'paused';

export type TickEvent = {
    elapsed: number;
    delta: number;
};

export type TimerEvents = {
    start?: void;
    pause?: void;
    resume?: void;
    stop?: void;
    reset?: void;
    tick?: TickEvent;
    done?: void;
};

export interface TimeSource {
    now(): number;
}

export class SystemTimeSource implements TimeSource {
    now(): number {
        return Date.now();
    }
}
