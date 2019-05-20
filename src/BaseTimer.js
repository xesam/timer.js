const {Tick} = require('./Tick');

class BaseTimer {
    constructor(options = {}) {
        this._options = options;
        this._interval = 0;
        this._flyTotal = 0;
        this._ticker = new Tick({
            onTimeout: (time) => {
                this._onTimeout(time);
                this.onTick(time);
            }
        });
    }

    _onTimeout(time) {
        this._flyTotal += time.fly;
    }

    getTickInfo() {
        return this._flyTotal;
    }

    onTick(time) {
        let timeout = this._interval - (time.fly - time.timeout);
        if (this._ticker.start(timeout)) {
            this._options.onTick && this._options.onTick(this, this.getTickInfo());
        }
    }

    setInterval(interval) {
        this._interval = interval;
    }

    start() {
        if (this._ticker.start(this._interval)) {
            this._options.onStart && this._options.onStart(this, this.getTickInfo());
        }
    }

    pause() {
        if (this._ticker.pause()) {
            this._options.onPause && this._options.onPause(this, this.getTickInfo());
        }
    }

    resume() {
        if (this._ticker.resume()) {
            this._options.onResume && this._options.onResume(this, this.getTickInfo());
        }
    }

    stop() {
        if (this._ticker.stop()) {
            this._options.onStop && this._options.onStop(this, this.getTickInfo());
        }
    }
}

module.exports = BaseTimer;
