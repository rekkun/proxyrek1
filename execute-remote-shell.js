const Discord = require('discord.js');
const client = new Discord.Client();
const exec = require('child_process').exec;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
	client.user.setPresence({
        status: "online",
        game: {
            name: "Đang thực thi Shell Command",
            type: "STREAMING"
        }
    }); 
});

client.on('message', message => {
if (message.author.bot) return;
	if (message.content.startsWith('cmd')) {

		var testscript = exec(message.content.slice(4));
		testscript.stdout.on('data', function(data){
		message.channel.send(data);
		// sendBackInfo();
	});

	testscript.stderr.on('data', function(data){
		message.channel.send(data);
		// triggerErrorStuff();
	});
	}
	if (message.content === 'ip') {
		var request = require('request');
		var url = 'http://myexternalip.com/raw';
		request(url, function (err, resp, myip) {
		  message.channel.send(myip);
		});
	}
	if (message.content === 'startproxy') {
		var httpProxy = require("http-proxy");
		var http = require("http");
		var url = require("url");
		var net = require('net');

		var port_heroku = process.env.PORT || 80;
		var server = http.createServer(function (req, res) {
		  var urlObj = url.parse(req.url);
		  var target = urlObj.protocol + "//" + urlObj.host;

		  message.channel.send("Proxy HTTP request for:", target);

		  var proxy = httpProxy.createProxyServer({});
		  proxy.on("error", function (err, req, res) {
			message.channel.send("proxy error", err);
			res.end();
		  });

		  proxy.web(req, res, {target: target});
		}).listen(port_heroku);  //this is the port your clients will connect to
		message.channel.send(port_heroku);
		var regex_hostport = /^([^:]+)(:([0-9]+))?$/;

		var getHostPortFromString = function (hostString, defaultPort) {
		  var host = hostString;
		  var port = defaultPort;

		  var result = regex_hostport.exec(hostString);
		  if (result != null) {
			host = result[1];
			if (result[2] != null) {
			  port = result[3];
			}
		  }

		  return ( [host, port] );
		};

		server.addListener('connect', function (req, socket, bodyhead) {
		  var hostPort = getHostPortFromString(req.url, 443);
		  var hostDomain = hostPort[0];
		  var port = parseInt(hostPort[1]);
		  message.channel.send("Proxying HTTPS request for:", hostDomain, port);

		  var proxySocket = new net.Socket();
		  proxySocket.connect(port, hostDomain, function () {
			  proxySocket.write(bodyhead);
			  socket.write("HTTP/" + req.httpVersion + " 200 Connection established\r\n\r\n");
			}
		  );

		  proxySocket.on('data', function (chunk) {
			socket.write(chunk);
		  });

		  proxySocket.on('end', function () {
			socket.end();
		  });

		  proxySocket.on('error', function () {
			socket.write("HTTP/" + req.httpVersion + " 500 Connection error\r\n\r\n");
			socket.end();
		  });

		  socket.on('data', function (chunk) {
			proxySocket.write(chunk);
		  });

		  socket.on('end', function () {
			proxySocket.end();
		  });

		  socket.on('error', function () {
			proxySocket.end();
		  });

		});
	}
})
client.login('NjY4MDkwMTAyMTYwODE4MTg2.Xj7Q9A.xVedSOhVuxiU7D_qdywVGT1YRqA');