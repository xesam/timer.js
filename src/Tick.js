const STATE = {
    RUNNING: 0,
    PAUSED: 1,
    STOPPED: 2,
};

class Tick {
    constructor() {
        this._flag = -1;
        this.time = {
            timeout: 0,
            fly: 0
        };
    }

    getTime() {
        return this.time;
    }

    start(timeout = 0) {
        this.time = {
            timeout: timeout,
            fly: 0
        };
        this.runningTime = Date.now();
        this.tick(this.time.timeout);
    }

    pause() {
        clearTimeout(this._flag);
        this.pauseTime = Date.now();
        this.time.fly += this.pauseTime - this.runningTime;
    }

    resume() {
        this.runningTime = Date.now();
        this.tick(this.time.timeout - this.time.fly);
    }

    stop() {
        clearTimeout(this._flag);
        this.time.fly += Date.now() - this.runningTime;
    }

    tick(timeout) {
        this._flag = setTimeout(() => {
            this.time.fly = Date.now() - this.runningTime;
            this._onTickHandler && this._onTickHandler(this.time);
        }, timeout);
    }

    onTick(cbk) {
        this._onTickHandler = cbk;
        return this;
    }
}

exports.STATE = STATE;
exports.Tick = Tick;
