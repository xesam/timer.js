const { EmitterTimer } = require('..');

function getDataSource() {
    return [1, 2, 3];
}

jest.useFakeTimers('modern');

describe('EmitterTimer', () => {
    it('should emit events', () => {
        const emitterTimer = new EmitterTimer(getDataSource(), 1000);
        const items = [];
        emitterTimer.on('data', ({ data, index }) => {
            items.push(data);
        });
        emitterTimer.start();
        jest.advanceTimersByTime(1000);
        expect(items).toStrictEqual([1]);
        jest.advanceTimersByTime(1000);
        expect(items).toStrictEqual([1, 2]);
        jest.advanceTimersByTime(1000);
        expect(items).toStrictEqual([1, 2, 3]);
        jest.advanceTimersByTime(1000);
    });
});
