'use strict';
// catRoute

// Require
var express = require('express');
var passport = require('../utils/pass');

const { body: validate } = require('express-validator');
const userController = require('../controllers/userController');

// Init
var router = express.Router();

// Configure
router.use(express.json());
router.use(express.urlencoded({ extended: false }));
router.use(passport.initialize());


// Route
router.get('/:name',passport.authenticate('jwt', { session: false }), userController.users_get);
router.get('/',passport.authenticate('jwt', { session: false }), userController.users_get);

router.put('/', [
  validate('name', "name does not exist").exists().notEmpty()
],passport.authenticate('jwt', { session: false }), userController.user_update);

router.delete('/:name', userController.user_delete);
router.delete('/', [
  validate('name', "name does not exist").exists().notEmpty()
],passport.authenticate('jwt', { session: false }), userController.user_delete);


router.post('/', [
  validate('name', "name does not exist").exists().notEmpty(),
  validate('pass', "pass does not exist").exists().notEmpty(),
  validate('email', "email does not exist").exists().notEmpty()
], userController.user_create, userController.login);


router.post('/register', [
  validate('name', "name does not exist").exists().notEmpty(),
  validate('pass', "pass does not exist").exists().notEmpty(),
  validate('email', "email does not exist").exists().notEmpty()
], userController.user_create, userController.login);

// Login
router.post('/login', userController.login);
router.post('/logout', userController.logout);


// Run
module.exports = router;
