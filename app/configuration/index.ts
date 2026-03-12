// @ts-nocheck
import fs from 'fs';
import joi from 'joi';
import setValue from 'set-value';

const VAR_FILE_SUFFIX = '__FILE';

/*
 * Get a prop by path from environment variables.
 * @param prop
 * @returns {{}}
 */
export function get(prop, env = process.env) {
    const object = {};
    const envVarPattern = prop.replace(/\./g, '_').toUpperCase();
    const matchingEnvVars = Object.keys(env).filter((envKey) =>
        envKey.startsWith(envVarPattern),
    );
    matchingEnvVars.forEach((matchingEnvVar) => {
        const envVarValue = env[matchingEnvVar];
        const matchingPropPath = matchingEnvVar
            .replace(/_/g, '.')
            .toLowerCase();
        const matchingPropPathWithoutPrefix = matchingPropPath.replace(
            `${prop}.`,
            '',
        );
        setValue(object, matchingPropPathWithoutPrefix, envVarValue);
    });
    return object;
}

/**
 * Lookup external secrets defined in files.
 * @param btEnvVars
 */
export function replaceSecrets(btEnvVars) {
    const secretFileEnvVars = Object.keys(btEnvVars).filter((btEnvVar) =>
        btEnvVar.toUpperCase().endsWith(VAR_FILE_SUFFIX),
    );
    secretFileEnvVars.forEach((secretFileEnvVar) => {
        const secretKey = secretFileEnvVar.replace(VAR_FILE_SUFFIX, '');
        const secretFilePath = btEnvVars[secretFileEnvVar];
        const secretFileValue = fs.readFileSync(secretFilePath, 'utf-8');
        delete btEnvVars[secretFileEnvVar];
        btEnvVars[secretKey] = secretFileValue;
    });
}

// 1. Get a copy of all BigTower related env vars
export const btEnvVars = {};
Object.keys(process.env)
    .filter((envVar) => envVar.toUpperCase().startsWith('BT'))
    .forEach((btEnvVar) => {
        btEnvVars[btEnvVar] = process.env[btEnvVar];
    });

// 2. Replace all secret files referenced by their secret values
replaceSecrets(btEnvVars);

export function getVersion() {
    return btEnvVars.BT_VERSION || 'unknown';
}

export function getLogLevel() {
    return btEnvVars.BT_LOG_LEVEL || 'info';
}
/**
 * Get watcher configuration.
 */
export function getWatcherConfigurations() {
    return get('bt.watcher', btEnvVars);
}

/**
 * Get trigger configurations.
 */
export function getTriggerConfigurations() {
    return get('bt.trigger', btEnvVars);
}

/**
 * Get registry configurations.
 * @returns {*}
 */
export function getRegistryConfigurations() {
    return get('bt.registry', btEnvVars);
}

/**
 * Get authentication configurations.
 * @returns {*}
 */
export function getAuthenticationConfigurations() {
    return get('bt.auth', btEnvVars);
}

/**
 * Get Input configurations.
 */
export function getStoreConfiguration() {
    return get('bt.store', btEnvVars);
}

/**
 * Get Server configurations.
 */
export function getServerConfiguration() {
    const configurationFromEnv = get('bt.server', btEnvVars);
    const configurationSchema = joi.object().keys({
        enabled: joi.boolean().default(true),
        port: joi.number().default(3000).integer().min(0).max(65535),
        tls: joi
            .object({
                enabled: joi.boolean().default(false),
                key: joi.string().when('enabled', {
                    is: true,
                    then: joi.required(),
                    otherwise: joi.optional(),
                }),
                cert: joi.string().when('enabled', {
                    is: true,
                    then: joi.required(),
                    otherwise: joi.optional(),
                }),
            })
            .default({}),
        cors: joi
            .object({
                enabled: joi.boolean().default(false),
                origin: joi.string().default('*'),
                methods: joi.string().default('GET,HEAD,PUT,PATCH,POST,DELETE'),
            })
            .default({}),
        feature: joi
            .object({
                delete: joi.boolean().default(true),
            })
            .default({
                delete: true,
            }),
    });

    // Validate Configuration
    const configurationToValidate = configurationSchema.validate(
        configurationFromEnv || {},
    );
    if (configurationToValidate.error) {
        throw configurationToValidate.error;
    }
    return configurationToValidate.value;
}

/**
 * Get Prometheus configurations.
 */
export function getPrometheusConfiguration() {
    const configurationFromEnv = get('bt.prometheus', btEnvVars);
    const configurationSchema = joi.object().keys({
        enabled: joi.boolean().default(true),
    });

    // Validate Configuration
    const configurationToValidate = configurationSchema.validate(
        configurationFromEnv || {},
    );
    if (configurationToValidate.error) {
        throw configurationToValidate.error;
    }
    return configurationToValidate.value;
}

export function getPublicUrl(req) {
    const publicUrl = btEnvVars.BT_PUBLIC_URL;
    if (publicUrl) {
        return publicUrl;
    }
    // Try to guess from request
    return `${req.protocol}://${req.hostname}`;
}
