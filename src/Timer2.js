const STATE = {
    RUNNING: 0,
    PAUSED: 1,
    STOPPED: 2,
};

function _getNext(expectTickTime, expectInterval, elapsedTime) {
    while (expectTickTime <= elapsedTime) {
        expectTickTime += expectInterval;
    }
    return {
        expectTickTime: expectTickTime
    };
}

function _getNextTick(tick, expectInterval, elapsedTime) {
    let tickTime = tick.tickTime;
    while (tickTime <= elapsedTime) {
        tickTime += expectInterval;
    }
    return {
        tickTime: tickTime
    };
}

class Timer2 {
    constructor({interval = 1000, clock}) {
        this.clock = clock;
        this._interval = interval;
        this._state = STATE.STOPPED;
        this._timerFlag = -1;
        this._flyTotal = 0;
        this._pausedTotal = 0;
        this._startTime = -1;
        this._pauseTime = -1;
        this._realTickTime = -1;
        this._expectTickTime = -1;
    }

    _getElapse() {
        return this.clock.getElapsed();
    }

    _nextTick({expectTickTime, expectInterval, realInterval}) {
        this._timerFlag = this.clock.setTimeout(() => {
            this._realTickTime = this._getElapse();
            let expectFlyTotal = expectTickTime - this._startTime - this._pausedTotal;
            let realFlyTotal = this._realTickTime - this._startTime - this._pausedTotal;
            this._flyTotal = this._realTickTime - this._startTime - this._pausedTotal;
            this._onTick && this._onTick(this, {realFly: realFlyTotal, expectFly: expectFlyTotal});

            if (this.isRunning()) {
                let elapsedTime = this._getElapse();
                let next = _getNext(expectTickTime, expectInterval, elapsedTime);
                let realInterval = next.expectTickTime - elapsedTime;
                this._expectTickTime = next.expectTickTime;
                this._nextTick({
                    expectTickTime: next.expectTickTime,
                    expectInterval: expectInterval,
                    realInterval: realInterval,
                });
            }
        }, realInterval);
    }

    _next(lastExpectTick, expectInterval) {
        let elapsedTime = this._getElapse();
        let expectTick = _getNextTick(lastExpectTick, expectInterval, elapsedTime);
        let realInterval = expectTick.tickTime - elapsedTime;
        this._timerFlag = this.clock.setTimeout(() => {
            let realTick = this._getElapse();
            this._realTickTime = realTick;
            let expectFlyTotal = expectTick.tickTime - this._startTime - this._pausedTotal;
            let realFlyTotal = realTick - this._startTime - this._pausedTotal;
            this._flyTotal = realFlyTotal;
            this._onTick && this._onTick(this, {realFly: realFlyTotal, expectFly: expectFlyTotal});

            if (this.isRunning()) {
                this._next(expectTick, expectInterval);
            }
        }, realInterval);
    }

    _clearTimer() {
        this.clock.clearTimeout(this._timerFlag);
        this._timerFlag = -1;
    }

    isRunning() {
        return this._state === STATE.RUNNING;
    }

    isPaused() {
        return this._state === STATE.PAUSED;
    }

    start() {
        if (this.isRunning()) {
            return;
        }
        this._state = STATE.RUNNING;
        this._flyTotal = 0;
        this._pausedTotal = 0;
        this._startTime = this._getElapse();
        this._pauseTime = -1;
        this._realTickTime = this._startTime;
        this._expectTickTime = this._startTime + this._interval;
        this._onStarted && this._onStarted(this, this._flyTotal);
        this._nextTick({
            expectTickTime: this._expectTickTime,
            expectInterval: this._interval,
            realInterval: this._interval
        });
    }

    pause() {
        if (!this.isRunning()) {
            return;
        }
        this._state = STATE.PAUSED;
        this._clearTimer();
        this._pauseTime = this._getElapse();
        this._flyTotal += this._pauseTime - this._realTickTime;
        this._onPaused && this._onPaused(this, this._flyTotal);
    }

    resume() {
        if (!this.isPaused()) {
            return;
        }
        this._state = STATE.RUNNING;
        let paused = this._getElapse() - this._pauseTime;
        this._pausedTotal += paused;
        let left = this._expectTickTime - this._pauseTime;
        this._expectTickTime += paused;
        this._onResumed && this._onResumed(this, this._flyTotal);
        this._nextTick({
            expectTickTime: this._expectTickTime,
            expectInterval: this._interval,
            realInterval: left
        });
    }

    stop() {
        if (!this.isRunning()) {
            return;
        }
        this._state = STATE.STOPPED;
        this._clearTimer();
        this._flyTotal += this._getElapse() - this._realTickTime;
        this._onStopped && this._onStopped(this, this._flyTotal);
    }

    onTick(cbk) {
        this._onTick = cbk;
        return this;
    }

    onStarted(cbk) {
        this._onStarted = cbk;
        return this;
    }

    onPaused(cbk) {
        this._onPaused = cbk;
        return this;
    }

    onResumed(cbk) {
        this._onResumed = cbk;
        return this;
    }

    onStopped(cbk) {
        this._onStopped = cbk;
        return this;
    }
}

