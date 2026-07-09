import { Timer } from '../src/Timer';
import { IntervalTick } from '../src/IntervalTick';

jest.useFakeTimers();

class ResetAwareTimer extends Timer {
    derived = 0;

    markDerived(value: number): void {
        this.derived = value;
    }

    protected _reset_(): void {
        this.derived = 0;
    }
}

class CountingTickerTimer extends Timer {
    static initializationCount = 0;

    protected getInitialTicker() {
        CountingTickerTimer.initializationCount += 1;
        return super.getInitialTicker();
    }
}

function init() {
    const startCallback = jest.fn();
    const pauseCallback = jest.fn();
    const resumeCallback = jest.fn();
    const stopCallback = jest.fn();
    const tickCallback = jest.fn();

    const timer = new Timer(1000);
    timer.on('start', startCallback);
    timer.on('stop', stopCallback);
    timer.on('pause', pauseCallback);
    timer.on('resume', resumeCallback);
    timer.on('tick', tickCallback);

    return {
        timer,
        startCallback,
        pauseCallback,
        resumeCallback,
        stopCallback,
        tickCallback
    };
}

describe('test Timer callback', () => {
    it('init -> start', () => {
        const { timer, startCallback } = init();
        timer.start();
        expect(startCallback).toHaveBeenCalledTimes(1);
    });

    it('init -> stop', () => {
        const { timer, stopCallback } = init();
        timer.stop();
        expect(stopCallback).not.toHaveBeenCalled();
    });

    it('init -> pause', () => {
        const { timer, pauseCallback } = init();
        timer.pause();
        expect(pauseCallback).not.toHaveBeenCalled();
    });

    it('init -> resume', () => {
        const { timer, resumeCallback } = init();
        timer.resume();
        expect(resumeCallback).not.toHaveBeenCalled();
    });

    it('init -> start -> start', () => {
        const { timer, startCallback } = init();
        timer.start();
        timer.start();
        expect(startCallback).toHaveBeenCalledTimes(1);
    });

    it('init -> start -> stop', () => {
        const { timer, stopCallback } = init();

        timer.start();
        expect(stopCallback).not.toHaveBeenCalled();

        timer.stop();
        expect(stopCallback).toHaveBeenCalledTimes(1);
    });

    it('init -> start -> pause', () => {
        const { timer, pauseCallback } = init();

        timer.start();
        expect(pauseCallback).not.toHaveBeenCalled();

        timer.pause();
        expect(pauseCallback).toHaveBeenCalledTimes(1);
    });

    it('init -> start -> resume', () => {
        const { timer, resumeCallback } = init();

        timer.start();
        expect(resumeCallback).not.toHaveBeenCalled();

        timer.resume();
        expect(resumeCallback).not.toHaveBeenCalled();
    });

    it('init -> start -> stop -> stop', () => {
        const { timer, stopCallback } = init();

        timer.start();
        expect(stopCallback).not.toHaveBeenCalled();

        timer.stop();
        timer.stop();
        expect(stopCallback).toHaveBeenCalledTimes(1);
    });

    it('init -> start -> stop -> start', () => {
        const { timer, startCallback } = init();

        timer.start();
        timer.stop();
        timer.start();
        expect(startCallback).toHaveBeenCalledTimes(2);
    });

    it('init -> start -> pause -> resume', () => {
        const { timer, pauseCallback, resumeCallback } = init();

        timer.start();
        expect(pauseCallback).not.toHaveBeenCalled();
        expect(resumeCallback).not.toHaveBeenCalled();

        timer.pause();
        expect(pauseCallback).toHaveBeenCalledTimes(1);

        timer.resume();
        expect(resumeCallback).toHaveBeenCalledTimes(1);
    });
});

describe('test Timer', () => {
    it('initializes an overridden ticker only once during construction', () => {
        CountingTickerTimer.initializationCount = 0;

        const timer = new CountingTickerTimer(1000);

        expect(timer).toBeInstanceOf(CountingTickerTimer);
        expect(CountingTickerTimer.initializationCount).toBe(1);
    });

    it('remains assignable to the IntervalTick public shape', () => {
        const asIntervalTick = (timer: IntervalTick): IntervalTick => timer;
        const timer = new Timer(1000);

        expect(asIntervalTick(timer)).toBe(timer);
    });

    it('start', () => {
        const { timer, tickCallback } = init();
        timer.start();

        jest.advanceTimersByTime(500);
        expect(tickCallback).toHaveBeenCalledTimes(0);

        jest.advanceTimersByTime(500);
        expect(tickCallback).toHaveBeenCalledTimes(1);
        expect(tickCallback).toHaveBeenLastCalledWith({ elapsed: 1000, delta: 1000 });

        jest.advanceTimersByTime(5000);
        expect(tickCallback).toHaveBeenCalledTimes(6);
    });

    it('start stop', () => {
        const { timer, tickCallback } = init();
        timer.start();
        timer.stop();

        jest.advanceTimersByTime(5000);
        expect(tickCallback).toHaveBeenCalledTimes(0);
    });

    it('start pause', () => {
        const { timer, tickCallback } = init();
        timer.start();
        timer.pause();
        jest.advanceTimersByTime(5000);
        expect(tickCallback).toHaveBeenCalledTimes(0);
    });

    it('start pause resume', () => {
        const { timer, tickCallback } = init();
        timer.start();
        timer.pause();
        timer.resume();
        jest.advanceTimersByTime(5000);
        expect(tickCallback).toHaveBeenCalledTimes(5);
    });

    it('start pause resume pause', () => {
        const { timer, tickCallback } = init();
        timer.start();
        timer.pause();
        timer.resume();
        timer.pause();
        jest.advanceTimersByTime(5000);
        expect(tickCallback).toHaveBeenCalledTimes(0);
    });

    it('start pause resume stop', () => {
        const { timer, tickCallback } = init();
        timer.start();
        timer.pause();
        timer.resume();
        timer.stop();
        jest.advanceTimersByTime(5000);
        expect(tickCallback).toHaveBeenCalledTimes(0);
    });

    it('stop inside a tick listener prevents rescheduling', () => {
        const timer = new Timer(1000);
        const tickCallback = jest.fn(() => {
            timer.stop();
        });
        const stopCallback = jest.fn();
        const doneCallback = jest.fn();

        timer.on('tick', tickCallback);
        timer.on('stop', stopCallback);
        timer.on('done', doneCallback);

        timer.start();
        jest.advanceTimersByTime(1000);

        expect(tickCallback).toHaveBeenCalledTimes(1);
        expect(stopCallback).toHaveBeenCalledTimes(1);
        expect(doneCallback).toHaveBeenCalledTimes(0);
        expect(timer.state).toBe('idle');

        jest.advanceTimersByTime(3000);
        expect(tickCallback).toHaveBeenCalledTimes(1);
    });

    it('pause inside a tick listener prevents rescheduling until resume', () => {
        const timer = new Timer(1000);
        const tickCallback = jest.fn(() => {
            if (tickCallback.mock.calls.length === 1) {
                timer.pause();
            }
        });
        const pauseCallback = jest.fn();
        const doneCallback = jest.fn();

        timer.on('tick', tickCallback);
        timer.on('pause', pauseCallback);
        timer.on('done', doneCallback);

        timer.start();
        jest.advanceTimersByTime(1000);

        expect(tickCallback).toHaveBeenCalledTimes(1);
        expect(pauseCallback).toHaveBeenCalledTimes(1);
        expect(doneCallback).toHaveBeenCalledTimes(0);
        expect(timer.state).toBe('paused');

        jest.advanceTimersByTime(3000);
        expect(tickCallback).toHaveBeenCalledTimes(1);

        timer.resume();
        jest.advanceTimersByTime(1000);
        expect(tickCallback).toHaveBeenCalledTimes(2);
    });

    it('reset clears elapsed time and returns to idle', () => {
        const { timer } = init();
        const resetCallback = jest.fn();
        timer.on('reset', resetCallback);

        timer.start();
        jest.advanceTimersByTime(1000);
        timer.reset();

        expect(resetCallback).toHaveBeenCalledTimes(1);
        expect(timer.elapsed).toBe(0);
        expect(timer.state).toBe('idle');
    });

    it('reset calls the subclass reset hook', () => {
        const timer = new ResetAwareTimer(1000);
        timer.markDerived(7);

        timer.reset();

        expect(timer.derived).toBe(0);
        expect(timer.state).toBe('idle');
    });
});
