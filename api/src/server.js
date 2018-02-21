const app = require('polka')();
const static = require('serve-static');
const { server } = app.use(static('public'));

require('./signaling')(server);

module.exports = app;
