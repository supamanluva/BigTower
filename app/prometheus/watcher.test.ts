// @ts-nocheck
import * as watcher from './watcher';

test('watcher counter should be properly configured', async () => {
    watcher.init();
    const gauge = watcher.getWatchContainerGauge();
    expect(gauge.name).toStrictEqual('bt_watcher_total');
    expect(gauge.labelNames).toStrictEqual(['type', 'name']);
});
