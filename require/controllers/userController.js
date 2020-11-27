'use strict';

// Require
const jwt = require('jsonwebtoken');
const passport = require('passport');
const bcrypt = require('bcryptjs');

const { validationResult } = require('express-validator');
const userModel = require('../models/userModel');

const users_get = async (req, res) => {
  console.log(req.body);
  console.log(req.body.name);

  if (req.params.name != null) {
    res.json(await userModel.getUsers(req.params.name));
  }
  else {
    res.json(
      await userModel.getUsers(
        req.body.name,
        req.body.email
      )
    );
  }
};

const user_update = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log("Refused");
    console.log(errors);
    return res.status(400).json({ errors: errors.array() });
  }
  else {
    await userModel.updateUser(
      req.body.name,
      req.body.email,
      req.body.pass
    );

    res.status("204").end();
  }
};

const user_delete = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log("Refused");
    console.log(errors);
    return res.status(400).json({ errors: errors.array() });
  }
  else {
    if (req.params.name != null) // Passed in path
      await userModel.deleteUser(req.params.name);
    else // Passed in body
      await userModel.deleteUser(req.body.name);

    res.status("204").end();
  }
};

// AUTHENTICATION
const user_create = async (req, res, next) => {

  // Extract the validation errors from a request.
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log('user create error', errors);
    res.send(errors.array());
  }
  else {
    console.log("Hash created");

    const hashedpass = bcrypt.hashSync(req.body.pass);

    if (await userModel.addUser(req.body.name,req.body.email,hashedpass)) {
      next();
    } else {
      res.status(400).json({ error: 'register error' });
    }
  }
};

const login = (req, res) => {
  console.log('Login');


  console.log(req.body);
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      console.log("Error: " + err);
      return res.status(400).json({
        message: 'Something is not right',
        user: user
      });
    }

    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      // generate a signed son web token with the contents of user object and return it in the response s          
      const token = jwt.sign(user, 'your_jwt_secret');
      return res.json({ user, token });
    });

  })(req, res);
};

const logout = (req, res) => {
  console.log('Logout');
  req.logout();
  res.json({ message: 'logout' });
};

module.exports = {
  users_get,
  user_update,
  user_delete,
  user_create,
  login,
  logout
};