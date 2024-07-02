const mitt = require('mitt');

class IntervalTick {
    constructor(interval = 1000) {
        this._interval = interval;
        this._emitter = mitt();
        this._ticker = this.getInitialTicker();
    }

    get interval() {
        return this._interval;
    }

    getInitialTicker() {
        throw new Error('no ticker');
    }

    _keepContinue_() {
        return true;
    }

    emit(event, payload) {
        this._emitter.emit(event, payload);
    }

    on(event, listener) {
        this._emitter.on(event, listener);
    }

    start() {
        if (this._ticker.start(this._interval)) {
            this.emit('start');
        }
    }

    pause() {
        if (this._ticker.pause()) {
            this.emit('pause');
        }
    }

    resume() {
        if (this._ticker.resume()) {
            this.emit('resume');
        }
    }

    stop() {
        if (this._ticker.stop()) {
            this.emit('stop');
        }
    }
}

module.exports = IntervalTick;
