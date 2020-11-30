'use strict';

const postModel = require('../models/postModel');
const { validationResult } = require('express-validator');
const resize = require('../utils/resize');

const jwt = require('jsonwebtoken');

const posts_get = async (req, res) => {
    console.log(req.body);
    console.log(req.query);

    if (req.params.postId != null) {
        res.json(await postModel.getPosts(req.params.postId));
    }
    else if (Object.keys(req.query).length != 0) {
        res.json(
            await postModel.getPosts(
                req.query.postId,
                req.query.post,
                req.query.responseTo,
                req.query.poster,
                req.query.media,
                req.query.skip,
                req.query.take
            )
        );
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
        return res.status(400).json({ message: errors.array() });
    }
    else {

        var user = jwt.verify(req.headers.authorization.split(' ')[1], "your_jwt_secret");


        // Get post
        const poster = postModel.getPosts(req.body.postId).poster;

        // Validate access
        if (poster != user.name && user.name != "Admin")
            return res.status(400).json({
                message: 'You cannot modify the post of another person.',
                user: false
            });


        if (req.file) {
            resize.makeThumbnail(req.file.path, req.file.filename);
            const result = await postModel.updatePost(
                req.body.postId,
                req.body.post,
                req.body.responseTo,
                req.body.poster,
                req.file.filename
            );
            await res.json({ message: result });
        }
        else 
        {
            const result = await postModel.updatePost(
                req.body.postId,
                req.body.post,
                req.body.responseTo,
                req.body.poster,
                req.body.media
            );
            await res.json({ message: result });
        }
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
        // Validate token
        var user = jwt.verify(req.headers.authorization.split(' ')[1], "your_jwt_secret");


        if (req.params.postId != null) // Passed in path
        {
            // Get post
            const poster = postModel.getPosts(req.params.postId).poster;

            // Validate access
            if (poster != user.name && user.name != "Admin")
                return res.status(400).json({
                    message: 'You cannot delete the post of another person.',
                    user: false
                });

            const result = await postModel.deletePost(req.params.postId);
            await res.json({ message: result });
        }
        else // Passed in body
        {
            // Get post
            const poster = postModel.getPosts(req.body.postId).poster;

            // Validate access
            if (poster != user.name && user.name != "Admin")
                return res.status(400).json({
                    message: 'You cannot delete the post of another person.',
                    user: false
                });

            const result = await postModel.deletePost(req.body.postId);
            await res.json({ message: result });
        }
    }
};

const post_create = async (req, res) => {
    const errors = validationResult(req);
    console.log(JSON.stringify(req.body));

    // Validate input
    if (!errors.isEmpty()) {
        console.log("Refused");
        console.log(errors);
        return res.status(400).json({ errors: errors.array() });
    }
    else {
        try {

            // Validate token
            var user = jwt.verify(req.headers.authorization.split(' ')[1], "your_jwt_secret");


            // Validate access
            if (req.body.poster != user.name && user.name != "Admin")
                return res.status(400).json({
                    message: 'You cannot post on behalf of someone else.',
                    user: false
                });


            // make thumbnail
            if (req.file) {
                resize.makeThumbnail(req.file.path, req.file.filename);
                const result = await postModel.addPost(req.body.poster, req.body.post, req.body.responseTo, req.file.filename);
                await res.json({ message: result });
            }
            else {
                const result = await postModel.addPost(req.body.poster, req.body.post, req.body.responseTo);
                await res.json({ message: result });
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