const { CounterTimer } = require('../index');
jest.useFakeTimers('modern');

describe('CountTimer', () => {
    it('normal counter', () => {
        const counts = [];
        const timer = new CounterTimer(1000);
        timer.on('tick', () => {
            counts.push(timer.getCount());
        });

        timer.start();
        expect(counts).toStrictEqual([]);

        jest.advanceTimersByTime(1000);
        expect(counts).toStrictEqual([1]);

        jest.advanceTimersByTime(9000);
        expect(counts).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    it('counter with maxCount', () => {
        const counts = [];
        const timer = new CounterTimer(1000, 5);
        timer.on('tick', () => {
            counts.push(timer.getCount());
        });

        timer.start();
        expect(counts).toStrictEqual([]);

        jest.advanceTimersByTime(1000);
        expect(counts).toStrictEqual([1]);

        jest.advanceTimersByTime(9000);
        expect(counts).toStrictEqual([1, 2, 3, 4, 5]);
    });
});
