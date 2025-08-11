import { EmitterTimer } from '../src/EmitterTimer';

jest.useFakeTimers();

describe('EmitterTimer', () => {
    it('normal start', () => {
        const startCallback = jest.fn();
        const data = ['a', 'b', 'c'];
        const timer = new EmitterTimer(data, 1000);
        timer.on('start', startCallback);

        expect(startCallback).not.toHaveBeenCalled();

        timer.start();
        expect(startCallback).toHaveBeenCalledTimes(1);
    });

    it('normal tick', () => {
        const dataCallback = jest.fn();
        const data = ['a', 'b', 'c'];
        const timer = new EmitterTimer(data, 1000);
        timer.on('data', dataCallback);

        timer.start();
        jest.advanceTimersByTime(1200);
        expect(dataCallback).toHaveBeenCalledTimes(1);
        expect(dataCallback.mock.calls[0][0]).toEqual({ data: 'a', index: 0 });

        jest.advanceTimersByTime(1200);
        expect(dataCallback).toHaveBeenCalledTimes(2);
        expect(dataCallback.mock.calls[1][0]).toEqual({ data: 'b', index: 1 });
    });

    it('start tick finish', () => {
        const finishCallback = jest.fn();
        const data = ['a', 'b', 'c'];
        const timer = new EmitterTimer(data, 1000);
        timer.on('done', finishCallback);

        timer.start();
        jest.advanceTimersByTime(2999);
        expect(finishCallback).not.toHaveBeenCalled();

        jest.advanceTimersByTime(1);
        expect(finishCallback).toHaveBeenCalledTimes(1);
    });

    it('string data', () => {
        const dataCallback = jest.fn();
        const data = ['hello', 'world', 'test'];
        const timer = new EmitterTimer<string>(data, 1000);
        timer.on('data', dataCallback);

        timer.start();
        jest.advanceTimersByTime(1200);
        expect(dataCallback).toHaveBeenCalledTimes(1);
        expect(dataCallback.mock.calls[0][0]).toEqual({ data: 'hello', index: 0 });
    });

    it('number data', () => {
        const dataCallback = jest.fn();
        const data = [1, 2, 3, 4, 5];
        const timer = new EmitterTimer<number>(data, 1000);
        timer.on('data', dataCallback);

        timer.start();
        jest.advanceTimersByTime(1200);
        expect(dataCallback).toHaveBeenCalledTimes(1);
        expect(dataCallback.mock.calls[0][0]).toEqual({ data: 1, index: 0 });
    });
});