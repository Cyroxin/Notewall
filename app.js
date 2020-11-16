'use strict';

require('dotenv').config();
const production = process.env.production || 'false'; // Is running on server? "true"/"false"

/* REQUIRE */
//const express = require('express');
const express = require('express');

// const route = require('./routes/nameRoute'); // Example route

/* INIT */

const app = express();


/* CONFIGURE */
app.use(express.static('uploads'));


/* ROUTE */
//app.use('/nameOfRouteFolder', route); // EXAMPLE

// TODO: Implement routing in separate file


/* RUN */

if (production === "true") {
  console.log("production");
  require('./production')(app, 3000);
} else {
  console.log("development");
  require('./localhost')(app, 8000, 3000);
}

app.get('/', (req, res) => // Example
{
  res.send('Hello Secure World!');
});


app.get('/test', function (req, res) {
  res.send('hello world')
})

//module.export = production; // Is running on server? "true"/"false"