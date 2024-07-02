const { EmitterTimer } = require('..');

function getDataSource() {
    return [1, 2, 3];
}

jest.useFakeTimers('modern');

describe('EmitterTimer', () => {
    it('should emit events', () => {
        const timer = new EmitterTimer(getDataSource(), 1000);
        const items = [];
        timer.on('data', ({ data, index }) => {
            items.push(data);
        });
        timer.on('done', () => {
            items.push('finished');
        });

        timer.start();
        jest.advanceTimersByTime(1000);
        expect(items).toStrictEqual([1]);

        jest.advanceTimersByTime(1000);
        expect(items).toStrictEqual([1, 2]);

        jest.advanceTimersByTime(1000);
        expect(items).toStrictEqual([1, 2, 3, 'finished']);

        jest.advanceTimersByTime(1000);
        expect(items).toStrictEqual([1, 2, 3, 'finished']);
    });
});
