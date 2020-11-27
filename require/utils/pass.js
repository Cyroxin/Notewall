'use strict';

// Require
const passport = require('passport');
const passportJWT = require('passport-jwt');
const bcrypt = require('bcryptjs');

const userModel = require('../models/userModel');

// Init
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

// Configure
// Run
 

passport.use('local', new LocalStrategy({
    usernameField: 'name',
    passwordField: 'pass'
}, async (name, pass, done) => {
    try {
      const user = (await userModel.getUsers(name,null,false));
      //console.log('Local strategy', user);

      if (user === undefined) // incorrect name
      {
        return done(null, false);
      }

      console.log(pass);
      console.log(user.pass);

      if(pass === user.pass)
      {
        console.log("MATCH!");
      }
      else if (pass == user.pass)
      {
        console.log("match...");
      }

      if (!bcrypt.compareSync(pass,user.pass)) // incorrect password
      {
        return done(null, false);
      }

      delete user.pass; // remove password propety from user object
      return done(null, {...user}); // use spread syntax to create shallow copy to get rid of binary row type
    } catch (err) { // general error
      return done(err);
    }
  }
));


passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'
}, async (payload, done) => {
    return userModel.getUsers(payload.name)
        .then(user => {
            return done(null, {user});
        })
        .catch(err => {
            return done(err);
        });
}));

module.exports = passport;


