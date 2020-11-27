'use strict';

const postModel = require('../models/postModel');
const { validationResult } = require('express-validator');
const resize = require('../utils/resize');

const posts_get = async (req, res) => {
    console.log(req.body);
    console.log(req.body.postId);

    if (req.params.postId != null) {
        res.json(await postModel.getPosts(req.params.postId));
    }
    else {
        res.json(
            await postModel.getPosts(
                req.body.postId,
                req.body.post,
                req.body.responseTo,
                req.body.poster,
                req.body.media,
                req.body.skip,
                req.body.take
            )
        );
    }
}


const post_update = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log("Refused");
        console.log(errors);
        return res.status(400).json({ errors: errors.array() });
    }
    else {
        await postModel.updatePost(
            req.body.postId,
            req.body.post,
            req.body.responseTo,
            req.body.poster,
            req.body.media
        );

        res.status("204").end();
    }
};

const post_delete = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log("Refused");
        console.log(errors);
        return res.status(400).json({ errors: errors.array() });
    }
    else {
        if (req.params.postId != null) // Passed in path
            await postModel.deletePost(req.params.postId);
        else // Passed in body
            await postModel.deletePost(req.body.postId);

        res.status("204").end();
    }
};

const post_create = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log("Refused");
        console.log(errors);
        return res.status(400).json({ errors: errors.array() });
    }
    else {
        try {
            // make thumbnail
            if (req.file) {
                resize.makeThumbnail(req.file.path, req.file.filename);
                const post = await postModel.addPost(req.body.poster, req.body.post, req.body.responseTo, req.file.filename);
                await res.json({ message: post });
            }
            else {
                const post = await postModel.addPost(req.body.poster, req.body.post, req.body.responseTo);
                await res.json({ message: post });
            }
        }
        catch (e) {
            console.log('exit error', e);
            res.status(400).json({ message: 'error' });
        }
    }
};



module.exports = {
    posts_get,
    post_update,
    post_delete,
    post_create
};