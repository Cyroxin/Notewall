'use strict';
export { url, createPost, createPostWithMedia, getPosts, deletePost, updatePost, updatePostWithMedia, createUser, getUsers, deleteUser, updateUser, refresh, login, logout, register, isLoggedOn };

// You should write any url prefixes that you may require in the "/app" section when on a production machine.
const url = window.location.hostname == "localhost" ? window.location.origin : window.location.origin + "/app";


// Example: await getPosts(11) 
// Example: await getPosts(null, "%story%")
// Example: await getPosts(null, null, null, "John") 
async function getPosts(postId = null, post = null, responseTo = null, poster = null, media = null, skip = null, take = null) {

    try {
        console.log(postId);

        var requestBody = `postId=${postId}&post=${post}&responseTo=${responseTo}&poster=${poster}&media=${media}&skip=${skip}&take=${take}`;

        const options = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        };

        const response = await fetch(url + '/posts?' + requestBody, options);
        const result = await response.json();

        // Error
        if (result.user != null && !result.user) {
            alert(result.message);
            return;
        }
        else if(result.errors != null)
        {
            console.log(result.errors);
            return;
        }

        return result;
    }
    catch (e) {
        console.log(e.message);
    }
}

// await deletePost(11)
async function deletePost(postId = null) {

    try {

        if (!isLoggedOn()) {
            alert("You must first login");
            return;
        }

        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        };


        const response = await fetch(url + `/posts/${postId}`, options);
        const result = await response.json();

        // Error
        if (result.user != null && !result.user) {
            alert(result.message);
            return;
        }
        else if(result.errors != null)
        {
            console.log(result.errors);
            return;
        }

        return result;
    }
    catch (e) {
        console.log(e.message);
    }
}

// Updates a post with media and sends a file request gui to the user.
// await createPostWithMedia("posterUsername","postContent","responseToPostId")
async function updatePostWithMedia(postId, post = null, responseTo = null, poster = null) {
    var input = document.createElement('input');
    input.type = 'file';
    input.id = 'media';
    input.click();
    input.addEventListener('change', async () => {await updatePost(postId,post,responseTo,poster, input.files[0]); refresh();}, false);
}

// await updatePost(14,"postContent","responseToPostId","posterUsername","Media")
async function updatePost(postId, post = null, responseTo = null, poster = null, media = null) {

    try {

        if (!isLoggedOn()) {
            alert("You must first login");
            return;
        }

        const requestBody = new FormData();
        requestBody.append("postId",postId);
        requestBody.append("post",post);
        requestBody.append("responseTo",responseTo);
        requestBody.append("poster",poster);
        requestBody.append("media",media);

        const options = {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: requestBody
        };

        const response = await fetch(url + `/posts`, options);
        const result = await response.json();

        console.log(result);
        // Error
        if (result.user != null && !result.user) {
            alert(JSON.stringify(result.message));
            return;
        }
        else if(result.errors != null)
        {
            console.log(result.errors);
            return;
        }

        console.log(result);

        return result;
    }
    catch (e) {
        console.log(e.message);
    }
}


// Creates a new post and sends a file request gui to the user.
// await createPostWithMedia("posterUsername","postContent","responseToPostId")
async function createPostWithMedia(poster, post, responseTo = null) {
    var input = document.createElement('input');
    input.type = 'file';
    input.id = 'media';
    input.click();
    input.addEventListener('change', async () => {await createPost(poster,post,responseTo,input.files[0]); refresh();}, false);
}


// Creates a new post, does not upload media, do not use the media parameter.
// await createPost("posterUsername","postContent","responseToPostId")
// await createPost("posterUsername","postContent","responseToPostId",selectMedia)
async function createPost(poster, post, responseTo = null, media = null) {

    try {

        if (!isLoggedOn()) {
            alert("You must first login");
            return;
        }

        const requestBody = new FormData();
        requestBody.append("poster",poster);
        requestBody.append("post",post);
        requestBody.append("responseTo",responseTo);
        requestBody.append("media",media);

        const options = {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: requestBody
        };

        const response = await fetch(url + `/posts`, options);
        const result = await response.json();

        // Error
        if (result.user != null && !result.user) {
            alert(result.message);
            return;
        }
        else if(result.errors != null)
        {
            console.log(result.errors);
            return;
        }

        return result;
    }
    catch (e) {
        console.log(e.message);
    }
}

/* USER REQUESTS */

// await login("name","pass")
async function login(name, pass) {

    try {

        if (isLoggedOn()) {
            throw new Error("You are already logged on");
        }

        var requestBody = {
            "name": name,
            "pass": pass
        };

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        };

        const response = await fetch(url + `/users/login`, options);
        const result = await response.json();

        // save token
        // Error
        if (result.user != null && !result.user) {
            console.log(result.message);
            throw new Error(result.message);
        }
        else if(result.errors != null)
        {
            console.log(result.errors);
            throw new Error(result.errors);
        }

        localStorage.setItem('token', result.token);
        localStorage.setItem('username', result.user.name);

        return result;
    }
    catch (e) {
        console.log(e.message);
        throw new Error(result.errors);
    }
}

// await logout()
async function logout() {

    try {

        if (!isLoggedOn()) {
            alert("You have not logged on yet");
            return;
        }

        const options = {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            }
        };

        const response = await fetch(url + `/users/logout`, options);
        const result = await response.json();

        // Remove token
        if (result.message == "logout")
        {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
        }
        else
        {
            throw new Error("Could not logout");
        }

        return result;
    }
    catch (e) {
        console.log(e.message);
        throw new Error(e.message);
    }
}

// Registers and logs the user on.
// await register("name","pass","email@mail.com")
async function register(name, pass, email) {

    try {
        if (isLoggedOn()) {
            alert("You are already logged in!");
            return;
        }

        var requestBody = {
            "name": name,
            "pass": pass,
            "email": email
        };

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        };

        const response = await fetch(url + `/users/register`, options);
        const result = await response.json();

        // Error
        if (result.user != null && !result.user) {
            alert(result.message);
            return;
        }
        else if(result.errors != null)
        {
            console.log(result.errors);
            alert("Could not register, user details may be taken or lacking in security");
            return;
        }

        localStorage.setItem('token', result.token);
        localStorage.setItem('username', result.user.name);

        return result;
    }
    catch (e) {
        console.log(e.message);
    }
}

function createUser(name, pass, email) { return register(name, pass, email) }


function isLoggedOn() {
    return localStorage.getItem('token') != null;
}

// Refreshes page so changes can be seen. Optional if changes are manually shown.
function refresh() {
    location.reload(); // Refresh page
}

// Gets users depending on either name, email or both.
// await getUsers("name","email@mail.com")
// await getUsers(null,"johns@mail.com")
async function getUsers(name = null, email = null) {

    try {
        if (!isLoggedOn()) {
            alert("You must be logged in!");
            return;
        }

        var requestBody = `name=${name}&email=${email}`;

        const options = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        };

        const response = await fetch(url + '/users?' + requestBody, options);
        const result = await response.json();

        // Error
        if (result.user != null && !result.user) {
            alert(result.message);
            return;
        }
        else if(result.errors != null)
        {
            console.log(result.errors);
            return;
        }

        return result;
    }
    catch (e) {
        console.log(e.message);
    }
}

// Updates the user information of a specific user.
// await updateUser("name","pass","email@mail.com")
async function updateUser(name, pass = null, email = null) {

    try {
        if (!isLoggedOn()) {
            alert("You must be logged in!");
            return;
        }

        var requestBody = {
            "name": name,
            "pass": pass,
            "email": email
        };

        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(requestBody)
        };

        const response = await fetch(url + `/users`, options);
        const result = await response.json();

        // Error
        if (result.user != null && !result.user) {
            alert(result.message);
            return;
        }
        else if(result.errors != null)
        {
            console.log(result.errors);
            return;
        }

        return result;
    }
    catch (e) {
        console.log(e.message);
    }
}

// Deletes a specific user
// await deleteUser("name")
async function deleteUser(name) {

    try {
        if (!isLoggedOn()) {
            alert("You must be logged in!");
            return;
        }

        var requestBody = {
            "name": name
        };

        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(requestBody)
        };

        const response = await fetch(url + `/users`, options);
        const result = await response.json();

        // Error
        if (result.user != null && !result.user) {
            alert(result.message);
            return;
        }
        else if(result.errors != null)
        {
            console.log(result.errors);
            return;
        }

        return result;
    }
    catch (e) {
        console.log(e.message);
    }
}
