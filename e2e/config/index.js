module.exports = {
    protocol: process.env.BT_PROTOCOL || 'http',
    host: process.env.BT_HOST || 'localhost',
    port: process.env.BT_PORT || 3000,
    username: process.env.BT_USERNAME || 'john',
    password: process.env.BT_PASSWORD || 'doe',
};
