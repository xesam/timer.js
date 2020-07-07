const {Tick} = require('./Tick');

class BaseTimer {
    constructor() {
        this.setInterval(0);
        this._ticker = new Tick((tick) => {
            this._onTick();
        });
    }

    _onTick() {
        this.onTick && this.onTick(this);
        this._ticker.start(this._interval);
    }

    setInterval(interval) {
        this._interval = interval;
    }

    start() {
        if (this._ticker.start(this._interval)) {
            this.onStart && this.onStart(this);
        }
    }

    pause() {
        if (this._ticker.pause()) {
            this.onPause && this.onPause(this);
        }
    }

    resume() {
        if (this._ticker.resume()) {
            this.onResume && this.onResume(this);
        }
    }

    stop() {
        if (this._ticker.stop()) {
            this.onStop && this.onStop(this);
        }
    }
}

module.exports = BaseTimer;
