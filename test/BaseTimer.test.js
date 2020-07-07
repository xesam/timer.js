const BaseTimer = require('../src/BaseTimer');
jest.useFakeTimers();


describe('test BaseTimer callback', () => {
    let timer = null;

    beforeEach(() => {
        timer = new BaseTimer();
        timer.setInterval(1_000);
    });

    it('init -> start', () => {
        const startCallback = jest.fn();
        timer.onStart = startCallback;

        expect(startCallback).not.toBeCalled();

        timer.start();
        expect(startCallback.mock.calls.length).toBe(1);
    });
    it('init -> stop', () => {
        const stopCallback = jest.fn();
        timer.onStop = stopCallback;

        timer.stop();
        expect(stopCallback).not.toBeCalled();
    });
    it('init -> pause', () => {
        const pauseCallback = jest.fn();
        timer.onPause = pauseCallback;

        timer.pause();
        expect(pauseCallback).not.toBeCalled();
    });
    it('init -> resume', () => {
        const resumeCallback = jest.fn();
        timer.onResume = resumeCallback;

        timer.resume();
        expect(resumeCallback).not.toBeCalled();
    });

    it('init -> start -> start', () => {
        const startCallback = jest.fn();
        timer.onStart = startCallback;

        expect(startCallback).not.toBeCalled();

        timer.start();
        timer.start();
        expect(startCallback.mock.calls.length).toBe(1);
    });
    it('init -> start -> stop', () => {
        const stopCallback = jest.fn();
        timer.onStop = stopCallback;

        timer.start();
        expect(stopCallback).not.toBeCalled();

        timer.stop();
        expect(stopCallback).toBeCalled();
    });
    it('init -> start -> pause', () => {
        const pauseCallback = jest.fn();
        timer.onPause = pauseCallback;

        timer.start();
        expect(pauseCallback).not.toBeCalled();

        timer.pause();
        expect(pauseCallback).toBeCalled();
    });
    it('init -> start -> resume', () => {
        const resumeCallback = jest.fn();
        timer.onResume = resumeCallback;

        timer.start();
        expect(resumeCallback).not.toBeCalled();

        timer.resume();
        expect(resumeCallback).not.toBeCalled();
    });

    it('init -> start -> stop -> stop', () => {
        const stopCallback = jest.fn();
        timer.onStop = stopCallback;

        timer.start();
        expect(stopCallback).not.toBeCalled();

        timer.stop();
        timer.stop();
        expect(stopCallback.mock.calls.length).toBe(1);
    });

    it('init -> start -> stop -> start', () => {
        const startCallback = jest.fn();
        timer.onStart = startCallback;

        timer.start();
        timer.stop();
        timer.start();
        expect(startCallback.mock.calls.length).toBe(2);
    });

    it('init -> start -> pause -> resume', () => {
        const pauseCallback = jest.fn();
        const resumeCallback = jest.fn();
        timer.onPause = pauseCallback;
        timer.onResume = resumeCallback;

        timer.start();
        expect(pauseCallback).not.toBeCalled();
        expect(resumeCallback).not.toBeCalled();

        timer.pause();
        expect(pauseCallback).toBeCalled();

        timer.resume();
        expect(resumeCallback).toBeCalled();
    });
})

describe('test BaseTimer', () => {
    let timer = null;

    beforeEach(() => {
        timer = new BaseTimer();
        timer.setInterval(1_000);
    });

    it('start', () => {
        let tickCount = 0;
        const tickCallback = jest.fn(() => {
            tickCount++
        });
        timer.onTick = tickCallback;

        expect(tickCount).toBe(0);

        timer.start();

        jest.advanceTimersByTime(500);
        expect(tickCount).toBe(0);

        jest.advanceTimersByTime(500);
        expect(tickCount).toBe(1);

        jest.advanceTimersByTime(5000);
        expect(tickCount).toBe(6);
    });

    it('start stop', () => {
        let tickCount = 0;
        const tickCallback = jest.fn(() => {
            tickCount++
        });
        timer.onTick = tickCallback;

        timer.start();
        timer.stop();
        jest.advanceTimersByTime(5000);
        expect(tickCount).toBe(0);

    });
    it('start pause', () => {
        let tickCount = 0;
        const tickCallback = jest.fn(() => {
            tickCount++
        });
        timer.onTick = tickCallback;

        timer.start();
        timer.pause();
        jest.advanceTimersByTime(5000);
        expect(tickCount).toBe(0);
    });
    it('start pause resume', () => {
        let tickCount = 0;
        const tickCallback = jest.fn(() => {
            tickCount++
        });
        timer.onTick = tickCallback;

        timer.start();
        timer.pause();
        timer.resume();
        jest.advanceTimersByTime(5000);
        expect(tickCount).toBe(5);
    });
    it('start pause resume pause', () => {
        let tickCount = 0;
        const tickCallback = jest.fn(() => {
            tickCount++
        });
        timer.onTick = tickCallback;

        timer.start();
        timer.pause();
        timer.resume();
        timer.pause();
        jest.advanceTimersByTime(5000);
        expect(tickCount).toBe(0);
    });
    it('start pause resume stop', () => {
        let tickCount = 0;
        const tickCallback = jest.fn(() => {
            tickCount++
        });
        timer.onTick = tickCallback;

        timer.start();
        timer.pause();
        timer.resume();
        timer.stop();
        jest.advanceTimersByTime(5000);
        expect(tickCount).toBe(0);
    });
})