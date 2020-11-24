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

//const cats = require('./routes/postRoute');
//const users = require('./routes/userRoute');
//const auth = require('./routes/authRoute');

//var passport = require('./utils/pass');

if (!production) {
  const cors = require('cors')
  app.use(cors());
}

/* INIT */

app.use(express.json());
//app.use(passport.initialize());

app.use(express.static('uploads'));
app.use(express.static('public_html'));
app.use('/thumbnails', express.static('thumbnails'));


/* CONFIGURE */


/* ROUTE */

//app.use('/cat', passport.authenticate('jwt', { session: false }), cats);
//app.use('/user', passport.authenticate('jwt', { session: false }), users);
//app.use('/auth', auth);

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


module.export = production; // Is running on server? "true"/"false"

/*END*/ 