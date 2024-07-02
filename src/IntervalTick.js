class IntervalTick {
    constructor(handleEvent = (x) => x, interval = 1000) {
        this._eventHandle = handleEvent;
        this._interval = interval;
        this._ticker = this.getInitialTicker();
    }

    get interval() {
        return this._interval;
    }

    getInitialTicker() {
        throw new Error('no ticker');
    }

    _onTick_() {
        return true;
    }

    emit(event) {
        this._eventHandle.call(this, event);
    }

    start() {
        if (this._ticker.start(this._interval)) {
            this.emit({ type: 'start' });
        }
    }

    pause() {
        if (this._ticker.pause()) {
            this.emit({ type: 'pause' });
        }
    }

    resume() {
        if (this._ticker.resume()) {
            this.emit({ type: 'resume' });
        }
    }

    stop() {
        if (this._ticker.stop()) {
            this.emit({ type: 'stop' });
        }
    }
}

module.exports = IntervalTick;
