const {Tick} = require('./Tick');

class CountdownTimer {
    constructor(total, interval, options = {}) {
        this._options = options;
        this._total = total;
        this._interval = interval;
        this._ticker = new Tick({
            onTimeout: (time) => {
                this.onTick(time);
            }
        });
    }

    onTick(time) {
        let realLeft = this._left - time.fly;
        if (realLeft > 0) {
            this._left = realLeft;
            if (realLeft < this._interval) {
                this._ticker.start(realLeft);
            } else {
                this._ticker.start(this._interval - (time.fly - time.timeout));
            }
        } else {
            this._left = 0;
        }

        this._options.onTick && this._options.onTick(this, this._left);
        if (this._left <= 0) {
            this._options.onFinish && this._options.onFinish(this, this._left);
        }
    }

    start() {
        this._left = this._total;
        this._ticker.start(this._interval);
        this._options.onStart && this._options.onStart(this, this._left);
    }

    pause() {
        this._ticker.pause();
        this._options.onPause && this._options.onPause(this, this._left);
    }

    resume() {
        this._options.onResume && this._options.onResume(this, this._left);
        this._ticker.resume();
    }

    stop() {
        this._ticker.stop();
        this._options.onStop && this._options.onStop(this, this._left);
    }
}

module.exports = CountdownTimer;
