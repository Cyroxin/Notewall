import * as request from './request.js';

document.getElementById("submit").addEventListener("click", (e) => {
    e.preventDefault()
    
    if (request.isLoggedOn()) 
    {
        request.logout().then(e => {
            request.login(document.getElementById("name").value, document.getElementById("pass").value).then(e => {

                console.log("Returning back 1");
                window.location.href="../index.html";

            }).catch(err => { alert(err.message); console.log("Oops");});

        }).catch(err => { alert(err.message); console.log("Oops 1");});
 
        console.log("User was already logged on, logging him off.");
    }
    else {
        request.login(document.getElementById("name").value, document.getElementById("pass").value).then(e => {

            console.log("Returning back 2");
            window.location.href="../index.html";

        }).catch(err => { alert(err.message); console.log("Oops 2");});
    }
});