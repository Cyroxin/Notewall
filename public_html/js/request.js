'use strict';
const url = window.location.origin;
//const url = 'https://localhost:8000'; // Todo: change url server side


// Example: await getPosts(11) 
// Example: await getPosts(null, "%story%")
// Example: await getPosts(null, null, null, "John") 
async function getPosts(postId = null, post = null, responseTo = null, poster = null, media = null, skip = 0, take = 10) {

    try {
        console.log(postId);

        var requestBody = `postId=${postId}&post=${post}&responseTo=${responseTo}&poster=${poster}&media=${media}&skip=${skip}&take=${take}`;

        const options = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            },
        };

        const response = await fetch(url + '/posts?' + requestBody, options);
        const result = await response.json();

        // Error
        if (result.user != null && !result.user)
        {
            alert(result.message);
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
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        };


        const response = await fetch(url + `/posts/${postId}`, options);
        const result = await response.json();

        // Error
        if (result.user != null && !result.user)
        {
            alert(result.message);
            return;
        }

        return result;
    }
    catch (e) {
        console.log(e.message);
    }
}

// await updatePost(14,"postContent","responseToPostId","posterUsername","Media")
async function updatePost(postId, post = null, responseTo = null, poster = null, media = null) {

    try {

        if (!isLoggedOn()) {
            alert("You must first login");
            return;
        }

        var requestBody = {
            "postId": postId,
            "post": post,
            "responseTo": responseTo,
            "poster": poster,
            "media": media
        };

        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            },
            body: JSON.stringify(requestBody)
        };

        const response = await fetch(url + `/posts`, options);
        const result = await response.json();

        // Error
        if (result.user != null && !result.user)
        {
            alert(result.message);
            return;
        }

        return result;
    }
    catch (e) {
        console.log(e.message);
    }
}

// await createPost("posterUsername","postContent","responseToPostId","Media")
async function createPost(poster, post, responseTo = null, media = null) {

    try {

        if (!isLoggedOn()) {
            alert("You must first login");
            return;
        }

        var requestBody = {
            "poster": poster,
            "post": post,
            "responseTo": responseTo,
            "media": media
        };

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            },
            body: JSON.stringify(requestBody)
        };

        const response = await fetch(url + `/posts`, options);
        const result = await response.json();

        // Error
        if (result.user != null && !result.user)
        {
            alert(result.message);
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
            alert("You are already logged on");
            return;
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
        if (result.user != null && !result.user)
        {
            alert(result.message);
            return;
        }
            
        sessionStorage.setItem('token', result.token);

        return result;
    }
    catch (e) {
        console.log(e.message);
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
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            }
        };

        const response = await fetch(url + `/users/logout`, options);
        const result = await response.json();

        // Remove token
        if (result.message == "logout")
            sessionStorage.removeItem('token');
        else
            console.error("Could not logout");

        return result;
    }
    catch (e) {
        console.log(e.message);
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
        if (result.user != null && !result.user)
        {
            alert(result.message);
            return;
        }

        sessionStorage.setItem('token', result.token);

        return result;
    }
    catch (e) {
        console.log(e.message);
    }
}

function createUser(name, pass, email) { return register(name, pass, email) }


function isLoggedOn() {
    return sessionStorage.getItem('token') != null;
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
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        };

        const response = await fetch(url + '/users?' + requestBody, options);
        const result = await response.json();

        // Error
        if (result.user != null && !result.user)
        {
            alert(result.message);
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
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            },
            body: JSON.stringify(requestBody)
        };

        const response = await fetch(url + `/users`, options);
        const result = await response.json();

        // Error
        if (result.user != null && !result.user)
        {
            alert(result.message);
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
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            },
            body: JSON.stringify(requestBody)
        };

        const response = await fetch(url + `/users`, options);
        const result = await response.json();

        // Error
        if (result.user != null && !result.user)
        {
            alert(result.message);
            return;
        }

        return result;
    }
    catch (e) {
        console.log(e.message);
    }
}