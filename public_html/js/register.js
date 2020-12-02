import * as request from './request.js';

document.getElementById("submit").addEventListener("click", (e) => {
    e.preventDefault()
    
    if (request.isLoggedOn()) 
    {
        request.logout().then(e => {
            request.register(document.getElementById("name").value, document.getElementById("pass").value,document.getElementById("email").value).then(e => {

                console.log("Returning back 1");
                window.location.href= request.url + "/index.html";

            }).catch(err => { alert(err.message); console.log(err.message);});

        }).catch(err => { alert(err.message); console.log(err.message);});
 
        console.log("User was already logged on, logging him off.");
    }
    else {
        request.register(document.getElementById("name").value, document.getElementById("pass").value,document.getElementById("email").value).then(e => {

            console.log("Returning back 2");
            window.location.href = request.url + "/index.html";

        }).catch(err => { alert(err.message); console.log(err.message);});
    }
});