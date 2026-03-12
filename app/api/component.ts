// @ts-nocheck
import { byValues, byString } from 'sort-es';

import express from 'express';
import nocache from 'nocache';
import * as registry from '../registry';
import * as componentStore from '../store/component';
import logger from '../log';
const log = logger.child({ component: 'api-component' });

/**
 * Map a Component to a displayable (api/ui) item.
 * @param key
 * @param component
 * @returns {{id: *}}
 */
function mapComponentToItem(key, component) {
    return {
        id: key,
        type: component.type,
        name: component.name,
        configuration: component.maskConfiguration(),
    };
}

/**
 * Return a list instead of a map.
 * @param listFunction
 * @returns {{id: string}[]}
 */
export function mapComponentsToList(components) {
    return Object.keys(components)
        .map((key) => mapComponentToItem(key, components[key]))
        .sort(
            byValues([
                [(x) => x.type, byString()],
                [(x) => x.name, byString()],
            ]),
        );
}

/**
 * Get all components.
 * @param req
 * @param res
 */
function getAll(req, res, kind) {
    res.status(200).json(mapComponentsToList(registry.getState()[kind]));
}

/**
 * Get a component by id.
 * @param req
 * @param res
 * @param listFunction
 */
export function getById(req, res, kind) {
    const { type, name } = req.params;
    const id = `${type}.${name}`;
    const component = registry.getState()[kind][id];
    if (component) {
        res.status(200).json(mapComponentToItem(id, component));
    } else {
        res.sendStatus(404);
    }
}

// Valid provider types per kind (allowlisted)
const VALID_PROVIDERS = {
    watcher: ['docker'],
    trigger: ['apprise', 'command', 'discord', 'docker', 'dockercompose', 'gotify', 'http', 'ifttt', 'kafka', 'mock', 'mqtt', 'ntfy', 'pushover', 'rocketchat', 'slack', 'smtp', 'telegram'],
    registry: ['acr', 'codeberg', 'custom', 'ecr', 'forgejo', 'gcr', 'ghcr', 'gitea', 'gitlab', 'hub', 'lscr', 'quay', 'trueforge'],
    authentication: ['basic', 'oidc'],
};

/**
 * Validate provider type for a given kind.
 */
function isValidProvider(kind, type) {
    return VALID_PROVIDERS[kind] && VALID_PROVIDERS[kind].includes(type.toLowerCase());
}

/**
 * Sanitize component name to prevent injection.
 */
function sanitizeName(name) {
    return /^[a-z0-9_-]+$/i.test(name) ? name.toLowerCase() : null;
}

/**
 * Create or update a component.
 */
async function createOrUpdate(req, res, kind) {
    const { type, name, configuration } = req.body;

    if (!type || !name) {
        return res.status(400).json({ error: 'type and name are required' });
    }

    const sanitizedName = sanitizeName(name);
    if (!sanitizedName) {
        return res.status(400).json({ error: 'name must contain only letters, numbers, hyphens, and underscores' });
    }

    if (!isValidProvider(kind, type)) {
        return res.status(400).json({
            error: `Invalid provider type '${type}' for ${kind}. Valid types: ${(VALID_PROVIDERS[kind] || []).join(', ')}`,
        });
    }

    const typeLower = type.toLowerCase();
    const id = `${typeLower}.${sanitizedName}`;

    try {
        // If already registered, deregister first
        const existing = registry.getState()[kind][id];
        if (existing) {
            await registry.deregisterComponent(existing, kind);
        }

        // Register the new component (this validates config via Joi schema)
        const componentPaths = {
            watcher: '../watchers/providers',
            trigger: '../triggers/providers',
            registry: '../registries/providers',
            authentication: '../authentications/providers',
        };

        await registry.registerComponent(
            kind,
            typeLower,
            sanitizedName,
            configuration || {},
            componentPaths[kind],
        );

        // Persist to store
        componentStore.saveComponentConfig(kind, typeLower, sanitizedName, configuration || {});

        // Return the new component
        const newComponent = registry.getState()[kind][id];
        if (newComponent) {
            log.info(`Created/updated ${kind}: ${id}`);
            res.status(200).json(mapComponentToItem(id, newComponent));
        } else {
            res.status(500).json({ error: 'Component registered but not found in state' });
        }
    } catch (e) {
        log.error(`Error creating ${kind} ${id}: ${e.message}`);
        res.status(400).json({ error: e.message });
    }
}

/**
 * Update an existing component's configuration.
 */
async function update(req, res, kind) {
    const { type, name } = req.params;
    const { configuration } = req.body;

    if (!sanitizeName(type) || !sanitizeName(name)) {
        return res.status(400).json({ error: 'Invalid type or name in URL' });
    }

    const id = `${type}.${name}`;

    const existing = registry.getState()[kind][id];
    if (!existing) {
        return res.status(404).json({ error: `${kind} '${id}' not found` });
    }

    if (!configuration || typeof configuration !== 'object') {
        return res.status(400).json({ error: 'configuration object is required' });
    }

    try {
        // Deregister old
        await registry.deregisterComponent(existing, kind);

        // Re-register with new config
        const componentPaths = {
            watcher: '../watchers/providers',
            trigger: '../triggers/providers',
            registry: '../registries/providers',
            authentication: '../authentications/providers',
        };

        await registry.registerComponent(
            kind,
            type,
            name,
            configuration,
            componentPaths[kind],
        );

        // Persist
        componentStore.saveComponentConfig(kind, type, name, configuration);

        const updated = registry.getState()[kind][id];
        if (updated) {
            log.info(`Updated ${kind}: ${id}`);
            res.status(200).json(mapComponentToItem(id, updated));
        } else {
            res.status(500).json({ error: 'Failed to re-register component' });
        }
    } catch (e) {
        log.error(`Error updating ${kind} ${id}: ${e.message}`);
        // Try to re-register with old config
        try {
            const componentPaths = {
                watcher: '../watchers/providers',
                trigger: '../triggers/providers',
                registry: '../registries/providers',
                authentication: '../authentications/providers',
            };
            await registry.registerComponent(
                kind,
                type,
                name,
                existing.configuration,
                componentPaths[kind],
            );
        } catch (rollbackError) {
            log.error(`Rollback also failed for ${kind} ${id}: ${rollbackError.message}`);
        }
        res.status(400).json({ error: e.message });
    }
}

/**
 * Delete a component.
 */
async function remove(req, res, kind) {
    const { type, name } = req.params;

    if (!sanitizeName(type) || !sanitizeName(name)) {
        return res.status(400).json({ error: 'Invalid type or name in URL' });
    }

    const id = `${type}.${name}`;

    const existing = registry.getState()[kind][id];
    if (!existing) {
        return res.status(404).json({ error: `${kind} '${id}' not found` });
    }

    try {
        await registry.deregisterComponent(existing, kind);
        componentStore.deleteComponentConfig(kind, type, name);
        log.info(`Deleted ${kind}: ${id}`);
        res.status(200).json({ message: `${kind} '${id}' removed` });
    } catch (e) {
        log.error(`Error deleting ${kind} ${id}: ${e.message}`);
        res.status(500).json({ error: e.message });
    }
}

/**
 * Init the component router.
 * @param kind
 * @returns {*|Router}
 */
export function init(kind) {
    const router = express.Router();
    router.use(nocache());
    router.get('/', (req, res) => getAll(req, res, kind));
    router.get('/:type/:name', (req, res) => getById(req, res, kind));
    router.post('/', (req, res) => createOrUpdate(req, res, kind));
    router.put('/:type/:name', (req, res) => update(req, res, kind));
    router.delete('/:type/:name', (req, res) => remove(req, res, kind));
    return router;
}
