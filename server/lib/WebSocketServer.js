const WebSocket = require('ws');
const url = require('url');
const ChannelManager = require('./ChannelManager');
const query = require('licia/query');

module.exports = class WebSocketServer {
  constructor() {
    this.channelManager = new ChannelManager();

    const wss = (this._wss = new WebSocket.Server({ noServer: true }));

    wss.on('connection', ws => {
      const type = ws.type;
      if (type === 'target') {
        const { id, _url, title, favicon, info } = ws;
        this.channelManager.createTarget(id, ws, _url, title, favicon, info);
      } else {
        const { id, target } = ws;
        this.channelManager.createClient(id, ws, target);
      }
    });
  }
  start(server) {
    const wss = this._wss;

    server.on('upgrade', function (request, socket, head) {
      const urlObj = url.parse(request.url);
      const pathname = urlObj.pathname.split('/');

      const type = pathname[1];
      const id = pathname[2];

      if (type === 'target' || type === 'client') {
        wss.handleUpgrade(request, socket, head, (ws, req) => {
          ws.type = type;
          ws.id = id;
          const q = query.parse(urlObj.query);
          if (type === 'target') {
            ws._url = q.url;
            ws.title = q.title;
            ws.favicon = q.favicon;
            ws.info = q.info
          } else {
            ws.target = q.target;
          }
          wss.emit('connection', ws, request);
        });
      } else {
        socket.destroy();
      }
    });
  }
};
