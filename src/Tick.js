const STATE = {
    RUNNING: 0,
    PAUSED: 1,
    STOPPED: 2,
};

const NOP = () => {
    console.log('tick timeout');
};

class Tick {
    constructor(onTimeout = NOP) {
        this._state = STATE.STOPPED;
        this._timerFlag = -1;
        this._flyMills = 0;
        this._timeoutMills = 0;
        this._onTimeout = onTimeout;
    }

    getElapsed() {
        return Date.now();
    }

    tick(timeout) {
        this._timerFlag = setTimeout(() => {
            this._state = STATE.STOPPED;
            this._flyMills += this.getElapsed() - this._runTime;
            this._onTimeout(this._flyMills);
        }, timeout);
        return true;
    }

    start(timeout = 0) {
        if (this._state !== STATE.STOPPED) {
            return false;
        }
        this._timeoutMills = timeout;
        this._flyMills = 0;
        this._runTime = this.getElapsed();
        this._state = STATE.RUNNING;
        this.tick(this._timeoutMills);
        return true;
    }

    pause() {
        if (this._state !== STATE.RUNNING) {
            return false;
        }
        this._state = STATE.PAUSED;
        clearTimeout(this._timerFlag);
        this._pauseTime = this.getElapsed();
        this._flyMills += this._pauseTime - this._runTime;
        return true;
    }

    resume() {
        if (this._state !== STATE.PAUSED) {
            return false;
        }
        this._runTime = this.getElapsed();
        this._state = STATE.RUNNING;
        this.tick(this._timeoutMills - this._flyMills);
        return true;
    }

    stop() {
        if (this._state === STATE.STOPPED) {
            return false;
        }
        this._state = STATE.STOPPED;
        clearTimeout(this._timerFlag);
        this._flyMills += this.getElapsed() - this._runTime;
        return true;
    }
}

exports.STATE = STATE;
exports.Tick = Tick;
