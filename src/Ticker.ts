const RUNNING = 'running' as const;
const PAUSED = 'paused' as const;
const STOPPED = 'stopped' as const;

type TickerState = typeof RUNNING | typeof PAUSED | typeof STOPPED;

const NOP = (x: number, ticker: Ticker): number => x;

export class Ticker {
    private _state: TickerState = STOPPED;
    private _timerFlag: NodeJS.Timeout | number = -1;
    private _flyMills: number = 0;
    private _timeoutMills: number = 0;
    private _runTime: number = 0;
    private _pauseTime: number = 0;
    private _onTimeout: (flyMills: number, ticker: Ticker) => void;

    constructor(onTimeout: (flyMills: number, ticker: Ticker) => void = NOP) {
        this._onTimeout = onTimeout;
    }

    getElapsed(): number {
        return Date.now();
    }

    getState(): TickerState {
        return this._state;
    }

    tick(timeout: number): boolean {
        this._timerFlag = setTimeout(() => {
            this._state = STOPPED;
            this._flyMills += this.getElapsed() - this._runTime;
            this._onTimeout(this._flyMills, this);
        }, timeout);
        return true;
    }

    start(timeout: number = 0): boolean {
        if (this._state !== STOPPED) {
            return false;
        }
        this._timeoutMills = timeout;
        this._flyMills = 0;
        this._runTime = this.getElapsed();
        this._state = RUNNING;
        this.tick(this._timeoutMills);
        return true;
    }

    pause(): boolean {
        if (this._state !== RUNNING) {
            return false;
        }
        this._state = PAUSED;
        clearTimeout(this._timerFlag as NodeJS.Timeout);
        this._pauseTime = this.getElapsed();
        this._flyMills += this._pauseTime - this._runTime;
        return true;
    }

    resume(): boolean {
        if (this._state !== PAUSED) {
            return false;
        }
        this._runTime = this.getElapsed();
        this._state = RUNNING;
        this.tick(this._timeoutMills - this._flyMills);
        return true;
    }

    stop(): boolean {
        if (this._state === STOPPED) {
            return false;
        }
        this._state = STOPPED;
        clearTimeout(this._timerFlag as NodeJS.Timeout);
        this._flyMills += this.getElapsed() - this._runTime;
        return true;
    }
}