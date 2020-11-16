'use strict';

/* REQUIRE */ 
const express = require('express');
const https = require('https'); // DO NOT REMOVE
const fs = require('fs');

// const route = require('./routes/nameRoute');

/* INIT */ 
const app = express();

const sslkey = fs.readFileSync('ssl-key.pem'); // DO NOT REMOVE
const sslcert = fs.readFileSync('ssl-cert.pem'); // DO NOT REMOVE

https.createServer({ key: sslkey, cert: sslcert }, app).listen(8000); // DO NOT REMOVE

app.get('/', (req, res) =>  // TODO: IMPLEMENT ROUTING, ALWAYS HAVE A ROOT!
{
  res.send('Hello Secure World!');
});

/* CONFIGURE */
app.use(express.static('uploads'));


/* ROUTE */
//app.use('/nameOfRouteFolder', route); // EXAMPLE

// TODO: Implement routing in separate file
app.get('/test', function (req, res) {
    res.send('hello world')
  })

/* RUN */ 

require('http').createServer((req, res) => // DO NOT REMOVE, REDIRECTS HTTP TRAFFIC 
{
  res.writeHead(301, { 'Location': 'https://localhost:8000' + req.url });
  res.end();
}).listen(3000);

module.exports = (app, httpsPort, httpPort) => {
  https.createServer(options, app).listen(httpsPort);
  http.createServer(httpsRedirect).listen(httpPort);
 };