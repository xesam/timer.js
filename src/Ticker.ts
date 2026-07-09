import { SystemTimeSource, TimeSource, TimerState } from './TimerTypes';

const RUNNING: TimerState = 'running';
const PAUSED: TimerState = 'paused';
const IDLE: TimerState = 'idle';

const NOP = (_flyMills: number, _ticker: Ticker): void => undefined;

export class Ticker {
    private _state: TimerState = IDLE;
    private _timerFlag: ReturnType<typeof setTimeout> | null = null;
    private _timeoutMills = 0;
    private _elapsedInSegment = 0;
    private _runTime = 0;
    private _isDispatching = false;

    constructor(
        private readonly _onTimeout: (flyMills: number, ticker: Ticker) => void = NOP,
        private readonly _timeSource: TimeSource = new SystemTimeSource()
    ) {}

    getElapsed(): number {
        return this._timeSource.now();
    }

    getState(): TimerState {
        return this._state;
    }

    getSegmentElapsed(): number {
        if (this._state === RUNNING) {
            return this._elapsedInSegment + (this.getElapsed() - this._runTime);
        }
        return this._elapsedInSegment;
    }

    private clearTimer(): void {
        if (this._timerFlag) {
            clearTimeout(this._timerFlag);
            this._timerFlag = null;
        }
    }

    tick(timeout: number): boolean {
        this._timerFlag = setTimeout(() => {
            const flyMills = this._elapsedInSegment + (this.getElapsed() - this._runTime);
            this._timerFlag = null;
            this._elapsedInSegment = 0;
            this._state = IDLE;
            this._isDispatching = true;
            try {
                this._onTimeout(flyMills, this);
            } finally {
                this._isDispatching = false;
            }
        }, timeout);
        return true;
    }

    start(timeout: number = 0): boolean {
        if (this._state !== IDLE) {
            return false;
        }
        this._timeoutMills = timeout;
        this._elapsedInSegment = 0;
        this._runTime = this.getElapsed();
        this._state = RUNNING;
        this.tick(this._timeoutMills);
        return true;
    }

    pause(): boolean {
        if (this._state === IDLE && this._isDispatching) {
            this._state = PAUSED;
            return true;
        }
        if (this._state !== RUNNING) {
            return false;
        }
        this.clearTimer();
        this._elapsedInSegment += this.getElapsed() - this._runTime;
        this._state = PAUSED;
        return true;
    }

    resume(): boolean {
        if (this._state !== PAUSED) {
            return false;
        }
        const remaining = Math.max(this._timeoutMills - this._elapsedInSegment, 0);
        this._runTime = this.getElapsed();
        this._state = RUNNING;
        this.tick(remaining);
        return true;
    }

    stop(): boolean {
        if (this._state === IDLE && !this._isDispatching) {
            return false;
        }
        if (this._state === RUNNING) {
            this._elapsedInSegment += this.getElapsed() - this._runTime;
        }
        this.clearTimer();
        this._state = IDLE;
        return true;
    }

    reset(): void {
        this.clearTimer();
        this._timeoutMills = 0;
        this._elapsedInSegment = 0;
        this._runTime = 0;
        this._state = IDLE;
    }
}
