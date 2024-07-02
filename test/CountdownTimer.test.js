const { CountdownTimer } = require('../index');
jest.useFakeTimers('modern');

describe('CountdownTimer', () => {
    it('normal start', () => {
        const startCallback = jest.fn();
        const timer = new CountdownTimer(
            ({ type }) => {
                if (type === 'start') {
                    startCallback();
                }
            },
            1000,
            10000
        );
        expect(startCallback).not.toBeCalled();
        timer.start();
        expect(startCallback).toBeCalledTimes(1);
    });

    it('start tick finish', () => {
        const finishCallback = jest.fn();
        const timer = new CountdownTimer(
            (event) => {
                if (event.type === 'finish') {
                    finishCallback();
                }
            },
            1000,
            10000
        );
        timer.start();
        jest.advanceTimersByTime(9999);
        expect(finishCallback).not.toBeCalled();
        expect(timer.getDuration()).toEqual(10000);
        jest.advanceTimersByTime(1);
        expect(finishCallback).toBeCalledTimes(1);
    });
});
