# @xesam/timer

跨平台的补偿式计时器原语，适用于浏览器、Node.js 与小程序等 JavaScript 运行时。

```bash
npm install @xesam/timer
```

## 项目背景

JavaScript 运行时（浏览器、Node.js、小程序）的定时器回调**不保证准时触发**：当前标签页被后台节流、设备休眠、主线程被长任务阻塞、小程序切后台挂起等情形都会导致 `setTimeout` / `setInterval` 延后触发甚至丢失回调。

传统基于"回调次数 × 间隔"累加的计时器在这种环境下会产生漂移 —— 暂停期间的时间被错误计入、被阻塞的回调丢失后无法补齐、暂停/恢复后续接的间隔重新从满值开始计时，最终 elapsed 与真实流逝时间出现不可恢复的偏差。

## 项目目的

提供一套**以真实运行时间为准**的计时器原语：

- 不依赖回调准时到达，而是在每次回调时根据真实流逝时间重算状态。
- 把"暂停时长不计入 elapsed"、"续接未完成的间隔片段"等语义内建到核心契约里。
- 在统一的 `Timer` 生命周期（`start / pause / resume / stop / reset`）之上派生出 `CountdownTimer`、`CounterTimer`、`EmitterTimer` 三种便利计时器，状态全部从核心派生，不再各自维护漂移计数器。

## 核心特性

- **补偿式计时**：以 `TimeSource.now()` 为基准衡量真实运行时间，pause 期间的 wall-clock 不计入 `elapsed`，`resume()` 续接被中断的间隔片段而非重启整段。
- **统一生命周期**：`Timer` 与三个便利计时器共享 `idle | running | paused` 状态机和 `start / pause / resume / stop / reset` 五个生命周期方法，事件名一致。
- **派生状态**：便利计时器的 `remaining / count / index` 等运行值由核心 `elapsed` 派生，避免各计时器独立累加导致的相互漂移。
- **可注入时钟**：`TimeSource` 接口允许注入自定义时钟，便于单元测试中用 `FakeClock` 精确推进时间。
- **跨运行时**：纯 JavaScript 实现，不依赖特定平台 API，浏览器 / Node / 小程序同一份代码。
- **类型完备**：用 TypeScript 编写，导出 `TimerState`、`TickEvent`、`TimeSource`、`TimerEvents` 等关键类型。
- **轻量**：仅依赖 `mitt`（同时作为 `peerDependencies`）。

## 本项目不解决

- 不是后台高精度计时器（标签页被后台节流时仍受平台限制）。
- 不是 cron、任务队列或调度框架。
- 不会在运行时被阻塞后回放每一个"逻辑上错过的 tick"。
- 不会绕过 JavaScript 运行时本身不提供的时序保证。

## 使用方式

### 核心 Timer

```ts
import { Timer, TickEvent, TimerState, TimeSource, SystemTimeSource } from '@xesam/timer';

const timer = new Timer(1000);

timer.on('tick', ({ elapsed, delta }: TickEvent) => {
    console.log({ elapsed, delta });
});

timer.start();
timer.pause();
timer.resume();
timer.stop();
timer.reset();

const state: TimerState = timer.state;
console.log(state, timer.elapsed);
```

`Timer` 生命周期事件：

- `start`、`pause`、`resume`、`stop`、`reset`
- `tick` 携带 `{ elapsed, delta }`

`Timer` 本身会持续 tick 直到调用 `stop()` 或 `reset()`，"完成"语义由便利计时器建模。

### 注入自定义时钟（用于测试）

```ts
import { Timer, TimeSource } from '@xesam/timer';

class FakeClock implements TimeSource {
    private value = 0;
    now(): number {
        return this.value;
    }
    advance(ms: number): void {
        this.value += ms;
    }
}

const clock = new FakeClock();
const testTimer = new Timer(250, { timeSource: clock });
```

### CountdownTimer — 倒计时

```ts
import { CountdownTimer } from '@xesam/timer';

const countdown = new CountdownTimer(1000, 5000); // 每 1s tick，总时长 5s

countdown.on('tick', ({ elapsed, delta, remaining }) => {
    console.log({ elapsed, delta, remaining });
});

countdown.on('done', ({ remaining }) => {
    console.log('finished with', remaining);
});
```

- 派生只读状态：`remaining`、`elapsed`、`duration`、`state`
- `tick` 与 `done` 负载：`{ elapsed, delta, remaining }`

### CounterTimer — 计数

```ts
import { CounterTimer } from '@xesam/timer';

const counter = new CounterTimer(1000, 3); // 每 1s 计一次，共 3 次

counter.on('tick', ({ count, elapsed }) => {
    console.log(count, elapsed);
});

counter.on('done', ({ count }) => {
    console.log('done at', count);
});
```

- 派生只读状态：`count`、`elapsed`、`state`
- 兼容方法：`getCount()`
- `tick` 与 `done` 负载：`{ elapsed, delta, count }`

### EmitterTimer — 序列发射

```ts
import { EmitterTimer } from '@xesam/timer';

const emitter = new EmitterTimer(['hello', 'world', 'timer'], 1000);

emitter.on('data', ({ index, data, elapsed, delta }) => {
    console.log(index, data, elapsed, delta);
});

emitter.on('done', ({ index, data }) => {
    console.log('last item', index, data);
});
```

- 派生只读状态：`index`、`elapsed`、`state`
- 兼容方法：`getIndex()`
- 事件负载：`data` 与 `done` 都携带 `{ elapsed, delta, data, index }`

## 补偿式保证模型

`@xesam/timer` 假定回调可能迟到。迟到发生时，库会基于真实运行时间重算状态，并从修正后的基线发出下一次可观测事件：

- **暂停期间不计入 `elapsed`** —— 只有计时器真正在 `running` 状态的时间才累加。
- **`resume()` 续接未完成的间隔片段**，而不是从满间隔重新开始。
- **`stop()` 保留已观测的进度**，而新的 `start()` 会从干净状态重新开始一次运行。
- **便利计时器状态派生自核心**，不会因各自维护计数器而漂移。

## 开发

```bash
npm test          # 运行 jest 测试
npm run build     # tsup 构建 ESM/CJS/DTS 三产物
npm run dev       # watch 构建
```

License: ISC
