const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');

const app = express();

const sslkey = fs.readFileSync('ssl-key.pem');
const sslcert = fs.readFileSync('ssl-cert.pem');
const options = { key: sslkey, cert: sslcert };

module.exports = (app, httpsPort, httpPort) => {
    app.enable('trust proxy');

    https.createServer(options, app).listen(httpsPort);
    http.createServer((req, res) => {
        const proxypath = process.env.PROXY_PASS || ''
        console.log(req.headers.host);
        res.writeHead(301, { 'Location': `https://${req.headers.host}${proxypath}${req.url}` });
        res.end();
    }).listen(httpPort);
};