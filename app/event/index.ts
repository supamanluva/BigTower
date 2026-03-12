// @ts-nocheck
import events from 'events';

// Build EventEmitter
const eventEmitter = new events.EventEmitter();

// Container related events
const BT_CONTAINER_ADDED = 'bt:container-added';
const BT_CONTAINER_UPDATED = 'bt:container-updated';
const BT_CONTAINER_REMOVED = 'bt:container-removed';
const BT_CONTAINER_REPORT = 'bt:container-report';
const BT_CONTAINER_REPORTS = 'bt:container-reports';

// Watcher related events
const BT_WATCHER_START = 'bt:watcher-start';
const BT_WATCHER_STOP = 'bt:watcher-stop';

/**
 * Emit ContainerReports event.
 * @param containerReports
 */
export function emitContainerReports(containerReports) {
    eventEmitter.emit(BT_CONTAINER_REPORTS, containerReports);
}

/**
 * Register to ContainersResult event.
 * @param handler
 */
export function registerContainerReports(handler) {
    eventEmitter.on(BT_CONTAINER_REPORTS, handler);
}

/**
 * Emit ContainerReport event.
 * @param containerReport
 */
export function emitContainerReport(containerReport) {
    eventEmitter.emit(BT_CONTAINER_REPORT, containerReport);
}

/**
 * Register to ContainerReport event.
 * @param handler
 */
export function registerContainerReport(handler) {
    eventEmitter.on(BT_CONTAINER_REPORT, handler);
}

/**
 * Emit container added.
 * @param containerAdded
 */
export function emitContainerAdded(containerAdded) {
    eventEmitter.emit(BT_CONTAINER_ADDED, containerAdded);
}

/**
 * Register to container added event.
 * @param handler
 */
export function registerContainerAdded(handler) {
    eventEmitter.on(BT_CONTAINER_ADDED, handler);
}

/**
 * Emit container added.
 * @param containerUpdated
 */
export function emitContainerUpdated(containerUpdated) {
    eventEmitter.emit(BT_CONTAINER_UPDATED, containerUpdated);
}

/**
 * Register to container updated event.
 * @param handler
 */
export function registerContainerUpdated(handler) {
    eventEmitter.on(BT_CONTAINER_UPDATED, handler);
}

/**
 * Emit container removed.
 * @param containerRemoved
 */
export function emitContainerRemoved(containerRemoved) {
    eventEmitter.emit(BT_CONTAINER_REMOVED, containerRemoved);
}

/**
 * Register to container removed event.
 * @param handler
 */
export function registerContainerRemoved(handler) {
    eventEmitter.on(BT_CONTAINER_REMOVED, handler);
}

export function emitWatcherStart(watcher) {
    eventEmitter.emit(BT_WATCHER_START, watcher);
}

export function registerWatcherStart(handler) {
    eventEmitter.on(BT_WATCHER_START, handler);
}

export function emitWatcherStop(watcher) {
    eventEmitter.emit(BT_WATCHER_STOP, watcher);
}

export function registerWatcherStop(handler) {
    eventEmitter.on(BT_WATCHER_STOP, handler);
}
