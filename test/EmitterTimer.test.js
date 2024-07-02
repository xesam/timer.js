const { EmitterTimer } = require('..');

function getDataSource() {
    return [1, 2, 3, 4, 5];
}

jest.useFakeTimers('modern');

describe('EmitterTimer', () => {
    it('should emit events', () => {
        const emitterTimer = new EmitterTimer(getDataSource(), 1000);

    });
});
