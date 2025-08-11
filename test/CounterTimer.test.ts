import { CounterTimer } from '../src/CounterTimer';

jest.useFakeTimers();

describe('CounterTimer', () => {
    it('normal start', () => {
        const startCallback = jest.fn();
        const timer = new CounterTimer(1000, 3);
        timer.on('start', startCallback);

        expect(startCallback).not.toHaveBeenCalled();

        timer.start();
        expect(startCallback).toHaveBeenCalledTimes(1);
    });

    it('normal tick', () => {
        const tickCallback = jest.fn();
        const timer = new CounterTimer(1000, 3);
        timer.on('tick', tickCallback);

        timer.start();
        jest.advanceTimersByTime(1200);
        expect(tickCallback).toHaveBeenCalledTimes(1);
        expect(timer.getCount()).toEqual(1);

        jest.advanceTimersByTime(1200);
        expect(tickCallback).toHaveBeenCalledTimes(2);
        expect(timer.getCount()).toEqual(2);
    });

    it('start tick finish', () => {
        const finishCallback = jest.fn();
        const timer = new CounterTimer(1000, 3);
        timer.on('done', finishCallback);

        timer.start();
        jest.advanceTimersByTime(2999);
        expect(finishCallback).not.toHaveBeenCalled();

        jest.advanceTimersByTime(1);
        expect(finishCallback).toHaveBeenCalledTimes(1);
        expect(timer.getCount()).toEqual(3);
    });
});