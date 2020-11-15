'use strict';

/* REQUIRE */ 
const express = require('express');
// const route = require('./routes/nameRoute');

/* INIT */ 
const app = express();


/* CONFIGURE */
app.use(express.static('uploads'));
const port = 3000;

/* ROUTE */
//app.use('/nameOfRouteFolder', route);

// TODO: Implement routing in separate file
app.get('/test', function (req, res) {
    res.send('hello world')
  })

/* RUN */ 

app.listen(port, () => console.log(`App listening on port ${port}!`));
