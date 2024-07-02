const { CounterTimer } = require('../index');
jest.useFakeTimers('modern');

describe('CountTimer', () => {
    it('normal counter', () => {
        const timer = new CounterTimer(1000);
        expect(timer.getCount()).toBe(0);
        timer.start();
        jest.advanceTimersByTime(1000);
        expect(timer.getCount()).toBe(1);
        jest.advanceTimersByTime(10000);
        expect(timer.getCount()).toBe(11);
    });

    it('counter with maxCount', () => {
        const timer = new CounterTimer(1000, 5);
        expect(timer.getCount()).toBe(0);
        timer.start();
        jest.advanceTimersByTime(1000);
        expect(timer.getCount()).toBe(1);
        jest.advanceTimersByTime(10000);
        expect(timer.getCount()).toBe(5);
    });
});
