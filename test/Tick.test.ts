import { Ticker } from '../src/Ticker';

jest.useFakeTimers();

describe('test Ticker', () => {
    it('init state', () => {
        const ticker = new Ticker();
        expect(ticker.getState()).toBe('stopped');
    });

    it('start', () => {
        const ticker = new Ticker();
        ticker.start(1000);
        expect(ticker.getState()).toBe('running');
    });

    it('start twice', () => {
        const ticker = new Ticker();
        ticker.start(1000);
        expect(ticker.start(1000)).toBe(false);
    });

    it('start pause', () => {
        const ticker = new Ticker();
        ticker.start(1000);
        expect(ticker.pause()).toBe(true);
        expect(ticker.getState()).toBe('paused');
    });

    it('start stop', () => {
        const ticker = new Ticker();
        ticker.start(1000);
        expect(ticker.stop()).toBe(true);
        expect(ticker.getState()).toBe('stopped');
    });

    it('start pause resume', () => {
        const ticker = new Ticker();
        ticker.start(1000);
        ticker.pause();
        expect(ticker.resume()).toBe(true);
        expect(ticker.getState()).toBe('running');
    });

    it('start pause stop', () => {
        const ticker = new Ticker();
        ticker.start(1000);
        ticker.pause();
        expect(ticker.stop()).toBe(true);
        expect(ticker.getState()).toBe('stopped');
    });

    it('pause without start', () => {
        const ticker = new Ticker();
        expect(ticker.pause()).toBe(false);
    });

    it('resume without pause', () => {
        const ticker = new Ticker();
        expect(ticker.resume()).toBe(false);
    });

    it('stop without start', () => {
        const ticker = new Ticker();
        expect(ticker.stop()).toBe(false);
    });

    it('callback', () => {
        const callback = jest.fn();
        const ticker = new Ticker(callback);
        ticker.start(1000);
        expect(callback).not.toHaveBeenCalled();

        jest.advanceTimersByTime(1000);
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('callback with fly time', () => {
        const callback = jest.fn();
        const ticker = new Ticker(callback);
        ticker.start(1000);

        jest.advanceTimersByTime(1000);
        expect(typeof callback.mock.calls[0][0]).toBe('number');
        expect(callback.mock.calls[0][1]).toBe(ticker);
    });

    it('pause resume callback', () => {
        const callback = jest.fn();
        const ticker = new Ticker(callback);
        ticker.start(1000);
        ticker.pause();
        ticker.resume();

        jest.advanceTimersByTime(1000);
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('start stop callback', () => {
        const callback = jest.fn();
        const ticker = new Ticker(callback);
        ticker.start(1000);
        ticker.stop();

        jest.advanceTimersByTime(1000);
        expect(callback).not.toHaveBeenCalled();
    });
});