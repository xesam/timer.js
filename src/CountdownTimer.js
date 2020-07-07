const {Tick} = require('./Tick');

class CountdownTimer {
    constructor(duration, interval, options = {}) {
        this._duration = duration;
        this._left = this._duration;
        this._interval = interval;
        this._options = options;
        this._ticker = new Tick(flyMills => {
            this.onTick(flyMills);
        });
    }

    onTick(flyMills) {
        this._left -= flyMills;
        this._options.onTick && this._options.onTick(this._left > 0 ? this._left : 0);
        if (this._left <= 0) {
            this._options.onFinish && this._options.onFinish();
        } else {
            if (this._left < this._interval) {
                this._ticker.start(this._left);
            } else {
                this._ticker.start(this._interval);
            }
        }
    }

    start() {
        if (this._ticker.start(this._interval)) {
            this._options.onStart && this._options.onStart(this._left);
        }
    }

    pause() {
        if (this._ticker.pause()) {
            this._options.onPause && this._options.onPause(this._left);
        }
    }

    resume() {
        if (this._ticker.resume()) {
            this._options.onResume && this._options.onResume(this._left);
        }
    }

    stop() {
        if (this._ticker.stop()) {
            this._options.onStop && this._options.onStop(this._left);
        }
    }
}

module.exports = CountdownTimer;
