const STATE = {
    RUNNING: 0,
    PAUSED: 1,
    STOPPED: 2,
};

class Tick {
    constructor(options = {}) {
        this._flag = -1;
        this._time = {
            timeout: 0,
            fly: 0
        };
        this._options = options;
    }

    getTime() {
        return this._time;
    }

    getElapsed() {
        return Date.now();
    }

    start(timeout = 0) {
        this._time = {
            timeout: timeout,
            fly: 0
        };
        this._runTime = Date.now();
        this.tick(this._time.timeout);
    }

    pause() {
        clearTimeout(this._flag);
        this._pauseTime = this.getElapsed();
        this._time.fly += this._pauseTime - this._runTime;
    }

    resume() {
        this._runTime = this.getElapsed();
        this.tick(this._time.timeout - this._time.fly);
    }

    stop() {
        clearTimeout(this._flag);
        this._time.fly += this.getElapsed() - this._runTime;
    }

    tick(timeout) {
        this._flag = setTimeout(() => {
            this._time.fly += this.getElapsed() - this._runTime;
            this.onTick(this._time);
        }, timeout);
    }

    onTick(time) {
        this._options.onTick && this._options.onTick(time);
    }
}

exports.STATE = STATE;
exports.Tick = Tick;
