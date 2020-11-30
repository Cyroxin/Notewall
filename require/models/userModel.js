'use strict';

const { param } = require('../routes/postRoute');
const pool = require('../utils/db');
const promisePool = pool.promise();


/*
  getUsers: Gets a list of users that match the given parameters. Null means no filtering, no mandatory params.
  
  Params:
    * name = unique name of the user.
    * email = non-unique email, can lead to many results.
*/
async function getUsers(name = null, email = null, hidden = true) {
  if (!hidden) console.log(`Get user: ${name},${email}, ${hidden}`);
  try {
    if ((name == null && email == null) || (name == "null" && email == "null")) {
      const [rows] = await promisePool.query(`SELECT ${hidden ? "name,email" : "*"} FROM users`);
      return rows[0];
    }
    else if (name != null && name != "null") {
      const [rows] = await promisePool.query(`SELECT ${hidden ? "name,email" : "*"} FROM users WHERE name = ?`, [name]);
      return rows[0]; // We expect one result
    }
    else {
      const [rows] = await promisePool.query(`SELECT ${hidden ? "name,email" : "*"} FROM users WHERE email = ?`, [email]);
      return rows;
    }
  } catch (e) {
    console.log('error', e.message);
  }
};


/*
  updateUser: Changes user info. Null means no filtering, only name is mandatory.
  
  Params:
    * name = unique name of the user.
    * email = non-unique email.
    * pass = secret
*/
async function updateUser(name, email = null, pass = null) {
  console.log(`Update user: ${name},${email},${pass}`);
  var params = [];
  email != null ? params.push(email) : {};
  pass != null ? params.push(pass) : {};
  params.push(name);

  try {
    return await promisePool.query(`UPDATE users SET ${email != null ? "email=?" : ""} 
    ${(email != null && pass != null) ? " , " : ""} 
    ${pass != null ? "pass=?" : ""}  
    WHERE name=?;`,params);
  } catch (e) {
    console.log('error', e.message);
  }
};


/*
  deleteUser: Removes user. Must be provided a name which to delete.
*/
async function deleteUser(name) {
  console.log('Delete user: '+ name);

  try {
    return await promisePool.query("DELETE FROM users WHERE name=?", [name]);
  } catch (e) {
    console.log('error', e.message);
  }
};


/*
  deleteUser: Adds a user. All required.

  Params:
    * name = unique name of the user.
    * email = non-unique email.
    * pass = secret
*/
async function addUser(name, email, pass) {
  console.log(`Add user: ${name},${email},${pass}`);


  try {
    return await promisePool.query("INSERT INTO users (name, email, pass) VALUES (?, ?, ?)", [name, email, pass]);
  } catch (e) {
    console.log('error', e.message);
  }
}


module.exports = {
  getUsers,
  updateUser,
  deleteUser,
  addUser
};