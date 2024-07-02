const { Ticker } = require('../index');
jest.useFakeTimers('modern');

describe('test Tick', () => {
    it('normal start', () => {
        const mockCallback = jest.fn();
        const tick = new Ticker(mockCallback);

        tick.start(2000);
        expect(mockCallback).not.toBeCalled();

        jest.advanceTimersByTime(1500);
        expect(mockCallback).not.toBeCalled();

        jest.advanceTimersByTime(500);

        expect(mockCallback).toBeCalledTimes(1);
        expect(mockCallback.mock.calls[0][0]).toBe(2000);

        jest.advanceTimersByTime(2000);
        expect(mockCallback.mock.calls.length).toBe(1);

        jest.advanceTimersByTime(200000);
        expect(mockCallback.mock.calls.length).toBe(1);
    });

    it('start and stop', () => {
        const mockCallback = jest.fn();
        const tick = new Ticker(mockCallback);
        tick.start(2000);
        tick.stop();

        jest.advanceTimersByTime(2000);
        expect(mockCallback).not.toBeCalled();

        jest.advanceTimersByTime(200000);
        expect(mockCallback).not.toBeCalled();
    });

    it('start and pause', () => {
        const mockCallback = jest.fn();
        const tick = new Ticker(mockCallback);
        tick.start(2000);
        tick.pause();

        jest.advanceTimersByTime(2000);
        expect(mockCallback).not.toBeCalled();

        jest.advanceTimersByTime(200000);
        expect(mockCallback).not.toBeCalled();
    });

    it('start,pause,resume', () => {
        const mockCallback = jest.fn();
        const tick = new Ticker(mockCallback);
        tick.start(2000);
        tick.pause();
        tick.resume();

        jest.advanceTimersByTime(2000);
        expect(mockCallback).toBeCalled();

        jest.advanceTimersByTime(200000);
        expect(mockCallback).toBeCalledTimes(1);
        expect(mockCallback.mock.calls[0][0]).toBe(2000);
    });

    it('start,pause 1000,resume', () => {
        const mockCallback = jest.fn();
        const tick = new Ticker(mockCallback);
        tick.start(2000);
        tick.pause();
        jest.advanceTimersByTime(1000);
        tick.resume();

        jest.advanceTimersByTime(1000);
        expect(mockCallback).not.toBeCalled();

        jest.advanceTimersByTime(1000);
        expect(mockCallback).toBeCalled();

        jest.advanceTimersByTime(200000);
        expect(mockCallback).toBeCalledTimes(1);
        expect(mockCallback.mock.calls[0][0]).toBe(2000);
    });
});
