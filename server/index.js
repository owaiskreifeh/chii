const Koa = require('koa');

const router = require('./middle/router');
const compress = require('./middle/compress');
const util = require('./lib/util');
const WebSocketServer = require('./lib/WebSocketServer');
const https = require("https");

function start({ port = 8080, host, domain, server, ssl } = {}) {
  domain = domain || 'localhost:' + port;

  const app = new Koa();
  const wss = new WebSocketServer();

  app.use(compress()).use(router(wss.channelManager, domain));

  if (server) {
    server.on('request', app.callback());
    wss.start(server);
  } else {
    util.log(`starting server at ${domain}`);
    let server = null;
    if(ssl){
      
      const options = {
        key: fs.readFileSync("/etc/letsencrypt/live/tvtools.shahid.net/privkey.pem"),
        cert: fs.readFileSync("/etc/letsencrypt/live/tvtools.shahid.net/chain.pem")
      };

      server = https.createServer(options,app.callback()).listen(port, host);
    }else{
      server = app.listen(port, host);
    }
    wss.start(server);
  }
}

module.exports = {
  start,
};
