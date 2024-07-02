function getDataSource() {
    return [1, 2, 3, 4, 5];
}

describe('TimerEmitter', () => {
    it('should emit events', () => {
        const timerEmitter = new TimerEmitter(getDataSource, 1000, (data) => {
            // 处理事件
        });
        timerEmitter.start();
    });
});
