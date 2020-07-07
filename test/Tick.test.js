const {Tick} = require('../index');
jest.useFakeTimers();

describe('test Tick', () => {
    beforeEach(() => {
        mockCallback = jest.fn();
        tick = new Tick(mockCallback);
    });

    it('normal start', () => {
        expect(mockCallback).not.toBeCalled();
        tick.start(2_000);
        expect(mockCallback).not.toBeCalled();

        jest.advanceTimersByTime(1_500);
        expect(mockCallback).not.toBeCalled();

        jest.advanceTimersByTime(500);
        expect(mockCallback).toBeCalled();
        expect(mockCallback.mock.calls[0][0]).toEqual(tick);

        jest.advanceTimersByTime(2_000);
        expect(mockCallback).toBeCalled();
        expect(mockCallback.mock.calls[0][0]).toEqual(tick);

        jest.advanceTimersByTime(200_000);
        expect(mockCallback).toBeCalled();
        expect(mockCallback.mock.calls[0][0]).toEqual(tick);
    });

    it('start and stop', () => {
        tick.start(2_000);
        tick.stop();

        jest.advanceTimersByTime(2_000);
        expect(mockCallback).not.toBeCalled();

        jest.advanceTimersByTime(200_000);
        expect(mockCallback).not.toBeCalled();
    });

    it('start and pause', () => {
        tick.start(2_000);
        tick.pause();

        jest.advanceTimersByTime(2_000);
        expect(mockCallback).not.toBeCalled();

        jest.advanceTimersByTime(200_000);
        expect(mockCallback).not.toBeCalled();
    });

    it('start,pause,resume', () => {
        tick.start(2_000);
        tick.pause();
        tick.resume();

        jest.advanceTimersByTime(2_000);
        expect(mockCallback).toBeCalled();

        jest.advanceTimersByTime(200_000);
        expect(mockCallback.mock.calls.length).toBe(1);
    });

    it('start,pause 1000,resume', () => {
        tick.start(2_000);
        tick.pause();
        jest.advanceTimersByTime(1_000);
        tick.resume();

        jest.advanceTimersByTime(1_000);
        expect(mockCallback).not.toBeCalled();

        jest.advanceTimersByTime(1_000);
        expect(mockCallback).toBeCalled();

        jest.advanceTimersByTime(200_000);
        expect(mockCallback.mock.calls.length).toBe(1);
    });
})


