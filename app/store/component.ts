// @ts-nocheck
/**
 * Component configuration store.
 * Persists user-defined component configurations (watchers, registries, triggers, authentications)
 * so they survive container restarts without needing environment variables.
 */
import logger from '../log';
const log = logger.child({ component: 'store-component' });

let componentConfigs;

/**
 * Create component config collections.
 * @param db
 */
export function createCollections(db) {
    componentConfigs = db.getCollection('componentConfigs');
    if (componentConfigs === null) {
        log.info('Create Collection componentConfigs');
        componentConfigs = db.addCollection('componentConfigs', {
            unique: ['data.id'],
        });
    }
}

/**
 * Save a component configuration.
 * @param kind - 'watcher' | 'registry' | 'trigger' | 'authentication'
 * @param type - provider type (e.g. 'docker', 'hub', 'smtp')
 * @param name - instance name (e.g. 'local', 'myhub')
 * @param configuration - the configuration object
 */
export function saveComponentConfig(kind, type, name, configuration) {
    const id = `${kind}.${type}.${name}`;
    // Remove existing entry if any
    componentConfigs
        .chain()
        .find({ 'data.id': id })
        .remove();
    // Insert new
    componentConfigs.insert({
        data: {
            id,
            kind,
            type,
            name,
            configuration,
            updatedAt: new Date().toISOString(),
        },
    });
    log.info(`Saved component config: ${id}`);
    return { id, kind, type, name, configuration };
}

/**
 * Get all saved component configurations for a given kind.
 * @param kind
 * @returns {Array}
 */
export function getComponentConfigs(kind) {
    if (!componentConfigs) {
        return [];
    }
    return componentConfigs
        .find({ 'data.kind': kind })
        .map((item) => item.data);
}

/**
 * Get all saved component configurations (all kinds).
 * @returns {Array}
 */
export function getAllComponentConfigs() {
    if (!componentConfigs) {
        return [];
    }
    return componentConfigs.find().map((item) => item.data);
}

/**
 * Get a specific component configuration.
 * @param kind
 * @param type
 * @param name
 * @returns {Object|undefined}
 */
export function getComponentConfig(kind, type, name) {
    const id = `${kind}.${type}.${name}`;
    const result = componentConfigs.findOne({ 'data.id': id });
    return result ? result.data : undefined;
}

/**
 * Delete a component configuration.
 * @param kind
 * @param type
 * @param name
 * @returns {boolean} true if deleted
 */
export function deleteComponentConfig(kind, type, name) {
    const id = `${kind}.${type}.${name}`;
    const existing = componentConfigs.findOne({ 'data.id': id });
    if (existing) {
        componentConfigs
            .chain()
            .find({ 'data.id': id })
            .remove();
        log.info(`Deleted component config: ${id}`);
        return true;
    }
    return false;
}
