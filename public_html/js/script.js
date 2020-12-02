import * as request from './request.js';

const addBtn = document.getElementById("add");
const searchBar = document.getElementById("search");
const userIcon = document.getElementById("user");

if (request.isLoggedOn()) {
    userIcon.classList.toggle("fa-user-circle", false)
    userIcon.classList.toggle("fa-sign-out-alt", true)
}
else {
    userIcon.classList.toggle("fa-user-circle", true)
    userIcon.classList.toggle("fa-sign-out-alt", false)
}

userIcon.onclick = (e) => {
    if (request.isLoggedOn()) {
        e.preventDefault()
        request.logout()
            .then(function (result) {
                request.refresh();
            })
            .catch(function (error) {
                console.log("Error" + error);
            });
    }
}

console.log("Adding notes...");

if (localStorage.getItem("notes") == null)
    request.getPosts()
        .then(function (result) {
            // It worked, use the result
            localStorage.setItem("notes", JSON.stringify(result));
            request.refresh();

            console.log(localStorage.getItem("notes"));
        })
        .catch(function (error) {
            // It failed
            console.log("Error getting notes: " + error)
        });


const posts = JSON.parse(localStorage.getItem("notes"));


if (posts) {
    posts.forEach((post) => {
        addNewNote(post);
    });
}

searchBar.addEventListener("keypress", (e) => {
    console.log("key: " + JSON.stringify(e) + " - text:" + searchBar.value);
    if (e.key != "Enter") return;
    else parseAndRunSearch();
});

function parseAndRunSearch() {
    try {
        if (searchBar.value[0] == '!') // Command!
        {
            console.log("command");
            var postId = null;
            var post = null;
            var responseTo = null;
            var poster = null;
            var media = null;
            var skip = null;
            var take = null;

            const commands = searchBar.value.split('!').filter(e => e);
            console.log(commands);
            commands.forEach(e => {
                const keyval = e.split('=');
                const key = keyval[0];
                const val = keyval[1];

                console.log(key);
                console.log(val);

                if (key == "postId") {
                    postId = val;
                }
                else if (key == "post") {
                    post = val;
                }
                else if (key == "responseTo") {
                    responseTo = val;
                }
                else if (key == "poster") {
                    poster = val;
                }
                else if (key == "media") {
                    media = val;
                }
                else if (key == "skip") {
                    skip = val;
                }
                else if (key == "take") {
                    take = val;
                }
            });

            request.getPosts(postId, post, responseTo, poster, media, skip, take)
                .then(function (result) {
                    if (result != null && result.user != false && result.length > 0) 
                    {
                        localStorage.setItem("notes", JSON.stringify(result));
                        //console.log(JSON.stringify(result));
                        request.refresh();
                    }
                })
                .catch(function (error) {
                    console.log("Error" + error);
                });
        }
        else // Just a normal search.
        {
            request.getPosts(null, `%${searchBar.value}%`)
                .then(function (result) {
                    if (result != null && result.user != false && result.length > 0) {
                        localStorage.setItem("notes", JSON.stringify(result));
                        //console.log(JSON.stringify(result));
                        request.refresh();
                    }
                })
                .catch(function (error) {
                    console.log("Error" + error);
                });
        }
    }
    catch (err) { }
}

addBtn.addEventListener("click", () => {

    request.createPost(localStorage.getItem("username"), " ")
        .then(function (result) {
            if (result != null && result.user != false) {
                //addNewNote();
                localStorage.removeItem("notes");
                request.refresh();
            }
        })
        .catch(function (error) {
            console.log("Error" + error);
        });
});

function addNewNote(post) {
    console.log("Add note: " + post.post);

    const note = document.createElement("div");
    note.classList.add("note");

    note.innerHTML = `
        <div class="notes" id="${post.postId}">
            <div class="tools" style="white-space: nowrap; overflow:hidden;">
                <a class="postId" href="javascript:;" style="text-decoration:none;color:white;">${post.postId}</a> &nbsp;
                ${post.responseTo ? `<i class="fas fa-angle-double-right" aria-hidden="true"></i> &nbsp;
                <a class="responseTo" href="javascript:;" style="text-decoration:none;color:white;">${post.responseTo}</a> &nbsp;` : ""} &nbsp; 

                <i class="fas fa-user" aria-hidden="true"></i> &nbsp;

                <a class="name" href="javascript:;" style="text-decoration:none; color:white; text-overflow: ellipsis;overflow: hidden; white-space:nowrap;">${post.poster}</a>

                <button style="margin-left: auto;" class="reply"><i class="fas fa-reply"></i></button>
                <button class="upload"><i class="fas fa-file-image"></i></button>
                <button class="edit"><i class="fas fa-edit"></i></button>
                <button class="delete"><i class="fas fa-trash-alt"></i></button>
            </div>
            ${post.media ? `<div style="vertical-align: middle;"><img style="max-width:100%; max-height:100%; object-fit: contain;" class="image hidden" src="thumbnails/${post.media}"></div>` : ""}
            <div class="main ${post.post ? "" : "hidden"}"></div>
            <textarea class="${post.post ? "hidden" : ""}"></textarea>
        </div>
    `;

    const postIdText = note.querySelector(".postId");
    const responseToText = post.responseTo ? note.querySelector(".responseTo") : null;
    const userText = note.querySelector(".name");

    const replyBtn = note.querySelector(".reply");
    const uploadBtn = note.querySelector(".upload");
    const editBtn = note.querySelector(".edit");
    const deleteBtn = note.querySelector(".delete");

    const img = post.media ? note.querySelector(".image") : null;
    const main = note.querySelector(".main");
    const textArea = note.querySelector("textarea");

    textArea.value = post.post;
    main.innerHTML = marked(post.post);

    postIdText.addEventListener("click", () => {
        searchBar.value = `!responseTo=${post.postId}`;
        parseAndRunSearch();
    });

    if (post.responseTo) {
        responseToText.addEventListener("click", () => {
            searchBar.value = `!postId=${post.responseTo}`;
            parseAndRunSearch();
        });
    }

    userText.addEventListener("click", () => {
        searchBar.value = `!poster=${post.poster}`;
        parseAndRunSearch();
    });

    replyBtn.addEventListener("click", () => {
        if(!img.classList.contains("hidden")) return;
        
        request.createPost(localStorage.getItem("username"), " ", post.postId)
            .then(function (result) {
                if (result != null && result.user != false) {
                    //addNewNote();
                    localStorage.removeItem("notes");
                    request.refresh();
                }
            })
            .catch(function (error) {
                console.log("Error" + error);
            });
    });


    if (post.media) {
        main.addEventListener("click", () => {
            if (main.classList.contains("hidden")) return;
            img.classList.toggle("hidden");
            main.classList.toggle("hidden");
        });

        img.addEventListener("click", () => {
            img.classList.toggle("hidden");
            main.classList.toggle("hidden");
        });
    }

    uploadBtn.addEventListener("click", () => {
        request.updatePostWithMedia(post.postId)
            .then(function (result) {
                localStorage.removeItem("notes");
            })
            .catch(function (error) {
                console.log("Error" + error);
            });
    });

    editBtn.addEventListener("click", () => {
        if(!img.classList.contains("hidden")) return;

        if (!request.isLoggedOn()) {
            alert("You must be logged in to do this.");
            return;
        }

        main.classList.toggle("hidden");
        textArea.classList.toggle("hidden");

        // Finished editing, update.
        if (!main.classList.contains("hidden")) {
            request.updatePost(post.postId, main.innerText)
                .then(function (result) {
                    if (result != null && result.user != false) {
                        //note.remove();
                        //updateLS();
                        localStorage.removeItem("notes");
                        request.refresh();
                    }
                })
                .catch(function (error) {
                    console.log("Error" + error);
                });
        }


    });

    deleteBtn.addEventListener("click", () => {
        if(!img.classList.contains("hidden")) return;

        request.deletePost(post.postId)
            .then(function (result) {
                if (result != null && result.user != false) {
                    //note.remove();
                    //updateLS();
                    localStorage.removeItem("notes");
                    request.refresh();
                }
            })
            .catch(function (error) {
                console.log("Error" + error);
            });
    });

    textArea.addEventListener("input", (e) => {
        const { value } = e.target;

        console.log("textArea input" + value);
        main.innerHTML = marked(value);
        //updateLS();
    });

    document.body.appendChild(note);
}

function updateLS() {
    const notesText = document.querySelectorAll("textarea");

    const notes = [];

    notesText.forEach((note) => {
        notes.push(note.value);
    });

    localStorage.setItem("notes", JSON.stringify(notes));
}
