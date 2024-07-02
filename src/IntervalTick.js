class IntervalTick {
    constructor(handleEvent = (x) => x, interval = 1000) {
        this._eventHandle = handleEvent;
        this._ticker = this.getInitialTicker();
        this.setInterval(interval);
    }

    getInitialTicker() {
        throw new Error('no ticker');
    }

    setInterval(interval) {
        this._interval = interval;
        return this;
    }

    getInterval() {
        return this._interval;
    }

    onTick() {
        return true;
    }

    emitEvent(event) {
        this._eventHandle.call(this, event);
    }

    start() {
        if (this._ticker.start(this._interval)) {
            this.emitEvent({ type: 'start' });
        }
    }

    pause() {
        if (this._ticker.pause()) {
            this.emitEvent({ type: 'pause' });
        }
    }

    resume() {
        if (this._ticker.resume()) {
            this.emitEvent({ type: 'resume' });
        }
    }

    stop() {
        if (this._ticker.stop()) {
            this.emitEvent({ type: 'stop' });
        }
    }
}

module.exports = IntervalTick;
