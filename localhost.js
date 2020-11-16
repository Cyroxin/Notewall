// cut-pasted code about localhost: require, tls certs, options,...

const https = require('https'); // DO NOT REMOVE
const http = require('http');
const fs = require('fs');

const sslkey = fs.readFileSync('ssl-key.pem'); // DO NOT REMOVE
const sslcert = fs.readFileSync('ssl-cert.pem'); // DO NOT REMOVE


const options = { key: sslkey, cert: sslcert };


module.exports = (app, httpsPort, httpPort) => {
    https.createServer(options, app).listen(httpsPort);
    http.createServer(httpsRedirect).listen(httpPort);
   };