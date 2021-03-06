const Koa = require('koa');

const router = require('./middle/router');
const compress = require('./middle/compress');
const util = require('./lib/util');
const WebSocketServer = require('./lib/WebSocketServer');

function start() {
  const port = process.env.PORT;
  const domain = (process.env.HEROKU_APP_NAME || 'aqueous-bastion-16978') + '.herokuapp.com';

  const app = new Koa();
  const wss = new WebSocketServer();

  app.use(compress()).use(router(wss.channelManager, domain));

  util.log(`starting server at ${domain}`);
  const server = app.listen(port);
  wss.start(server);
}

module.exports = {
  start,
};
