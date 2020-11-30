'use strict';
const pool = require('../utils/db');
const promisePool = pool.promise();

/*
  getPosts: Gets a list of posts that match the given parameters. Null means no filtering, no mandatory params.
  
  Params:
    * postId = Id/index of the post. Begins from 1 up until unsigned int max
    * post = partial text content search for a specific post.
    * responseTo = id/index of post that the post is responding to. Ensure id != responseTo.
    * poster = poster's username, which is a foreign key to users.name.
    * media = link to any media file, most probably an image.
    * skip = How many rows should be skipped
    * take = How many rows should be returned
  
  Note: If postId is queried, all filters are ignored.
*/
const getPosts = async (postId = null, post = null, responseTo = null, poster = null, media = null, skip = 0, take = 10 ) => {
  try {
    console.log('Get post: ' + postId);
    var query = 'SELECT * FROM posts WHERE ';
    var params = [];

    // FILTER

    if (postId !== null && postId !== "null") {
      query = query.concat("postId = ?");
      params.push(postId);
    }
    else {
      if (responseTo != null && responseTo !== "null") {
        query = query.concat("responseTo = ? AND ");
        params.push(responseTo);
      }
      if (poster != null && poster !== "null") {
        query = query.concat("poster = ? AND ");
        params.push(poster);
      }
      if (media != null && media !== "null") {
        query = query.concat("media = ? AND ");
        params.push(media);
      }
      if (post != null && post !== "null") {
        query = query.concat("post LIKE ? AND ");
        params.push(post);
      }

      if (params.length === 0)
        query = query.slice(0, -7); // Remove ending " WHERE "
      else
        query = query.slice(0, -5); // Remove ending " AND "
    }

    // SKIP & TAKE (OFFSET 0 LIMIT 10)
    query = query.concat(" LIMIT ? OFFSET ? ");
    params.push(parseInt(take));
    params.push(parseInt(skip));

    console.log(query);
    console.log(params);


    const [rows] = await promisePool.query(query, params);
    return rows;
  } catch (e) { console.log('error', e.message); }
};

/*
  updatePost: Modifies a specific post with a specified postId. At least postId and one modification needed.
  
  Params:
    * postId = Id/index of the post. Begins from 1 up until unsigned int max
    * post = partial text content search for a specific post.
    * responseTo = id/index of post that the post is responding to. Ensure id != responseTo.
    * poster = poster's username, which is a foreign key to users.name.
    * media = link to any media file, most probably an image.
*/
const updatePost = async (postId, post = null, responseTo = null, poster = null, media = null) => {
  try {
    console.log('Update post: ' + postId);
    var query = 'UPDATE posts SET ';
    var params = [];


    if (responseTo != null && responseTo !== "null") {
      query = query.concat("responseTo = ?, ");
      params.push(responseTo);
    }
    if (poster != null && poster !== "null") {
      query = query.concat("poster = ?, ");
      params.push(poster);
    }
    if (media != null && media !== "null") {
      query = query.concat("media = ?, ");
      params.push(media);
    }
    if (post != null && post !== "null") {
      query = query.concat("post = ?, ");
      params.push(post);
    }

    if (params.length === 0)
      return;

    query = query.slice(0, -2); // Remove ending ", "


    query = query.concat(" WHERE postId = ?");
    params.push(postId);


    const [rows] = await promisePool.query(query, params);
    return rows;
  } catch (e) { console.log('error', e.message); }
};


/*
  addPost: Adds a post with the specified parameters. At least poster and post are required.
  
  Params:
    * poster = poster's username, which is a foreign key to users.name.
    * post = partial text content search for a specific post.
    * responseTo = id/index of post that the post is responding to. Ensure id != responseTo.
    * media = link to any media file, most probably an image.
*/
const addPost = async (poster, post, responseTo = null, media = null) => {
  try {
    console.log(`Add post`);
    var query = 'INSERT INTO posts (poster, post, responseTo, media) VALUES (?, ?, ?, ?);';

    const [rows] = await promisePool.query(query, [poster, post, responseTo, media]);
    return rows;
  } catch (e) { console.log('error', e.message); }
};


/*
  deletePost: Removes a post with a specified postId
  
  Params:
    * postId = Id/index of the post. Begins from 1 up until unsigned int max
*/
const deletePost = async (postId) => {
  try {
    console.log(`Delete post: ?`, postId);
    return await promisePool.query("DELETE FROM posts WHERE postId=?", [postId]);
  } catch (e) {
    console.log('error', e.message);
  }
};


module.exports = {
  getPosts,
  updatePost,
  addPost,
  deletePost
};