'use strict';

require('dotenv').config();

/* env file:
DB_HOST=[host]
DB_USER=[user]
DB_PASS=[pass]
DB_NAME=[name]
production=false
*/

// On production, env file can also have line: "PROXY_PASS=/[proxy_pass]",
// which adds the following addition to the path "http://ip/[proxy_pass]/index.html"

const production = process.env.production || 'false'; // Is running on server? "true"/"false"
const port = 3000;

console.log("production: ", production);

/* REQUIRE */
const express = require('express');
const app = express();

const posts = require('./require/routes/postRoute');

//var passport = require('./utils/pass');

if (!production) {
  const cors = require('cors')
  app.use(cors());
}

/* INIT */

app.use(express.json());
//app.use(passport.initialize());

app.use('/uploads',express.static('uploads'));
app.use(express.static('public_html'));
app.use('/thumbnails', express.static('thumbnails'));


/* CONFIGURE */


/* ROUTE */

app.use('/posts'/*, passport.authenticate('jwt', { session: false })*/, posts);

app.get('/test', (req, res) => // Example
{
  res.send('Hello Secure World!');
});


/* RUN */


if (production) {
  require('./require/servers/production')(app, port);
} else {
  require('./require/servers/localhost')(app, 8000, port);
}

/* ROUTE */

app.use('/posts'/*, passport.authenticate('jwt', { session: false })*/, posts);
app.use('/users'/*, passport.authenticate('jwt', { session: false })*/, users);

app.get('/test', (req, res) => // Example
{
  res.send('Hello Secure World!');
});

module.export = production; // Is running on server? "true"/"false"

/*END*/ 