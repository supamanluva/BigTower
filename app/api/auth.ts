// @ts-nocheck
import express from 'express';
import session from 'express-session';
import ConnectLoki from 'connect-loki';
const LokiStore = ConnectLoki(session);
import passport from 'passport';
import passJs from 'pass';
import { v5 as uuidV5 } from 'uuid';
import getmac from 'getmac';
import rateLimit from 'express-rate-limit';
import * as store from '../store';
import * as registry from '../registry';
import log from '../log';
import { getVersion } from '../configuration';

const router = express.Router();

// The configured strategy ids.
const STRATEGY_IDS = [];

// Constant BigTower namespace for uuid v5 bound sessions.
const BT_NAMESPACE = 'dee41e92-5fc4-460e-beec-528c9ea7d760';

/**
 * Get all strategies id.
 * @returns {[]}
 */
export function getAllIds() {
    return STRATEGY_IDS;
}

/**
 * Get cookie max age.
 * @param days
 * @returns {number}
 */
function getCookieMaxAge(days) {
    return 3600 * 1000 * 24 * days;
}

/**
 * Get session secret key (bound to BigTower version).
 * @returns {string}
 */
function getSessionSecretKey() {
    const stringToHash = `bigtower.${getVersion()}.${getmac()}`;
    return uuidV5(stringToHash, BT_NAMESPACE);
}

/**
 * Register a strategy to passport.
 * @param authentication
 * @param app
 */
function useStrategy(authentication, app) {
    try {
        const strategy = authentication.getStrategy(app);
        passport.use(authentication.getId(), strategy);
        STRATEGY_IDS.push(authentication.getId());
    } catch (e) {
        log.warn(
            `Unable to apply authentication ${authentication.getId()} (${e.message})`,
        );
    }
}

function getUniqueStrategies() {
    const strategies = Object.values(registry.getState().authentication).map(
        (authentication) => authentication.getStrategyDescription(),
    );
    const uniqueStrategies = [];
    strategies.forEach((strategy) => {
        if (
            !uniqueStrategies.find(
                (item) =>
                    item.type === strategy.type && item.name === strategy.name,
            )
        ) {
            uniqueStrategies.push(strategy);
        }
    });
    return uniqueStrategies.sort((s1, s2) => s1.name.localeCompare(s2.name));
}

/**
 * Return the registered strategies from the registry.
 * @param req
 * @param res
 */
function getStrategies(req, res) {
    res.json(getUniqueStrategies());
}

function getLogoutRedirectUrl() {
    const strategyWithRedirectUrl = getUniqueStrategies().find(
        (strategy) => strategy.logoutUrl,
    );
    if (strategyWithRedirectUrl) {
        return strategyWithRedirectUrl.logoutUrl;
    }
    return undefined;
}

/**
 * Get current user.
 * @param req
 * @param res
 */
function getUser(req, res) {
    const user = req.user || { username: 'anonymous' };
    res.status(200).json(user);
}

/**
 * Login user (and return it).
 * @param req
 * @param res
 */
function login(req, res) {
    return getUser(req, res);
}

/**
 * Change password for basic auth users.
 */
function changePassword(req, res) {
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current password and new password are required' });
    }
    if (newPassword.length < 4) {
        return res.status(400).json({ error: 'New password must be at least 4 characters' });
    }

    // Find the basic auth provider for the current user
    const username = req.user?.username;
    if (!username || username === 'anonymous') {
        return res.status(403).json({ error: 'Password change not available for this account' });
    }

    const authProviders = Object.values(registry.getState().authentication);
    const basicProvider = authProviders.find(
        (auth) => auth.configuration?.user === username && typeof auth.authenticate === 'function',
    );

    if (!basicProvider) {
        return res.status(403).json({ error: 'Password change is only available for basic auth users' });
    }

    // Validate current password
    passJs.validate(currentPassword, basicProvider.configuration.hash, (err, success) => {
        if (!success) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Generate new hash
        passJs.generate(newPassword, (genErr, newHash) => {
            if (genErr) {
                log.error(`Failed to generate password hash: ${genErr.message}`);
                return res.status(500).json({ error: 'Failed to generate new password hash' });
            }

            // Update the provider's hash in memory
            basicProvider.configuration.hash = newHash;
            log.info(`Password changed for user: ${username}`);
            return res.status(200).json({ message: 'Password changed successfully' });
        });
    });
}

/**
 * Logout current user.
 * @param req
 * @param res
 */
function logout(req, res) {
    req.logout(() => {});
    res.status(200).json({
        logoutUrl: getLogoutRedirectUrl(),
    });
}

/**
 * Init auth (passport.js).
 * @returns {*}
 */
export function init(app) {
    // Init express session
    app.use(
        session({
            store: new LokiStore({
                path: `${store.getConfiguration().path}/${store.getConfiguration().file}`,
                ttl: 604800, // 7 days
            }),
            secret: getSessionSecretKey(),
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                maxAge: getCookieMaxAge(7),
                sameSite: 'lax',
                secure: 'auto',
            },
        }),
    );

    // Init passport middleware
    app.use(passport.initialize());
    app.use(passport.session());

    // Register all authentications
    Object.values(registry.getState().authentication).forEach(
        (authentication) => useStrategy(authentication, app),
    );

    passport.serializeUser((user, done) => {
        done(null, JSON.stringify(user));
    });

    passport.deserializeUser((user, done) => {
        done(null, JSON.parse(user));
    });

    // Rate limit login and password change endpoints
    const authLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 15, // 15 attempts per window
        standardHeaders: true,
        legacyHeaders: false,
        message: { error: 'Too many attempts, please try again later' },
    });

    // Return strategies
    router.get('/strategies', getStrategies);

    // Routes to protect after this line
    router.use(passport.authenticate(STRATEGY_IDS, { session: true }));

    // Add login/logout/change-password routes
    router.post('/login', authLimiter, login);

    router.get('/user', getUser);

    router.post('/change-password', authLimiter, express.json(), changePassword);

    router.post('/logout', logout);

    app.use('/auth', router);
}
