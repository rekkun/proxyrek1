var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer();
var fs = require('fs');

//
// Create an HTTP proxy server with an HTTPS target
//
httpProxy.createServer({
  target: {
    host: 'localhost',
    port: 8080
  },
  ssl: {
    key: fs.readFileSync('./server_key.pem', 'utf8'),
    cert: fs.readFileSync('./server_cert.pem', 'utf8')
  }
}).listen(80);