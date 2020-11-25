'use strict';
// postRoute

// Require

var express = require('express')
var multer = require('multer');

const { body: validate } = require('express-validator');

const postController = require('../controllers/postController');

// Init
var router = express.Router();
var upload = multer({ dest: './uploads/'})

// Configure

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

// Route

router.get('/:postId', postController.posts_get);
router.get('/',[
  validate('postId', "postId does not exist").optional().notEmpty(),
  validate('post', "post does not exist").optional().notEmpty(),
  validate('responseTo', "responseTo does not exist").optional().notEmpty(),
  validate('poster', "poster does not exist").optional().notEmpty(),
  validate('media', "media does not exist").optional().notEmpty(),
  validate('skip', "skip does not exist").optional().notEmpty(),
  validate('take', "take does not exist").optional().notEmpty()
], postController.posts_get);

router.put('/', [
    validate('postId', "postId does not exist").exists().notEmpty(),
    validate('post', "post does not exist").optional().notEmpty(),
    validate('responseTo', "responseTo does not exist").optional().notEmpty(),
    validate('media', "media does not exist").optional().notEmpty()
  ], postController.post_update);

router.post('/', upload.single('media'), [
    validate('poster', "poster does not exist").exists().notEmpty(),
    validate('post', "post does not exist").exists().notEmpty(),
    validate('responseTo', "responseTo does not exist").optional().notEmpty(),
    validate('media', "media does not exist").optional().notEmpty()
  ], postController.post_create);

router.delete('/',[
  validate('postId', "postId does not exist").exists().notEmpty()
], postController.post_delete);
router.delete('/:i', postController.post_delete);

// Run
module.exports = router;