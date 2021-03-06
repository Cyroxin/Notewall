import * as request from './request.js';

const addBtn = document.getElementById("add");
const searchBar = document.getElementById("search");
const eraseIcon = document.getElementById("erase");
const userIcon = document.getElementById("user");

/* LOGIN */

if (request.isLoggedOn()) {
    userIcon.classList.toggle("fa-user-circle", false);
    userIcon.classList.toggle("fa-sign-out-alt", true);

    addBtn.classList.toggle("hidden", false);
}
else {
    userIcon.classList.toggle("fa-user-circle", true);
    userIcon.classList.toggle("fa-sign-out-alt", false);

    addBtn.classList.toggle("hidden", true);
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

/* LOAD NOTES */

console.log("Adding notes...");

if (localStorage.getItem("notes") == null || localStorage.getItem("notes") == "undefined")
    request.getPosts()
        .then(function (result) {
            if (result == null) {
                console.error("Error, you may not be connected properly (proxy/vpn?) or the server is having an issue.");
                return;
            }
            // It worked, use the result
            localStorage.setItem("notes", JSON.stringify(result));
            request.refresh();

            console.log(localStorage.getItem("notes"));
        })
        .catch(function (error) {
            // It failed
            console.log("Error getting notes: " + error)
        });

// If an error is hit here, check that you can access the database. 
// Sometimes databases may require a specific vpn or proxy to be enabled.
// When you do get an error here, you need to delete the old note.
const posts = JSON.parse(localStorage.getItem("notes"));


if (posts) {
    posts.forEach((post) => {
        addNewNote(post);
    });
}

/* SEARCH BAR */

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
                    if (result != null && result.user != false && result.length > 0) {
                        localStorage.setItem("search", searchBar.value);
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
                        localStorage.setItem("search", searchBar.value);
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


/* ERASE SEARCH */

// Teach the user how to search using commands. 
searchBar.value = localStorage.getItem("search");

// Show erase searchbar icon only if searched something.
eraseIcon.classList.toggle("hidden", localStorage.getItem("search") == "" || !localStorage.getItem("search"));


eraseIcon.addEventListener("click", () => {
    localStorage.removeItem("search");
    localStorage.removeItem("notes");
    request.refresh();
});


/* ADD ICON */

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
        <div id="${post.postId}" style="height:inherit">
            <div class="tools">
                <a class="postId" href="javascript:;" style="text-decoration:none;color:white;margin-left:0.1em;">${post.postId}</a>
                ${post.responseTo ? `<i class="fas fa-angle-double-right" aria-hidden="true"></i>
                <a class="responseTo" href="javascript:;" style="text-decoration:none;color:white;">${post.responseTo}</a>` : ""}

                <i class="fas fa-user" aria-hidden="true" style="margin-left:0.2em; margin-right:0.2em;"></i>

                <a class="name" href="javascript:;" style="${post.poster == localStorage.getItem("username") ? "" : "text-decoration:none;"} color:white; text-overflow: ellipsis;overflow: hidden; white-space:nowrap;">${post.poster}</a>

                <div style="margin-left: auto;"></div>

                ${localStorage.getItem("username") != null ?
            `<button class="reply"><i class="fas fa-reply"></i></button>
                <button class="upload"><i class="fas fa-file-image"></i></button>
                <button class="edit"><i class="fas fa-edit"></i></button>
                <button class="delete"><i class="fas fa-trash-alt"></i></button>`: ''}
            </div>
            ${post.media ? `<img style="height:92%; width:100%;" class="image hidden" src="thumbnails/${post.media}">` : ""}
            <div class="main ${post.post != undefined ? "" : "hidden"}"></div>
            <textarea class="${post.post != undefined ? "hidden" : ""}"></textarea>
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

    if (replyBtn != null)
        replyBtn.addEventListener("click", () => {
            if (img != null && !img.classList.contains("hidden")) return;

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
        main.addEventListener("mouseup", () => {
            if (main.classList.contains("hidden") || hasSelectedText()) return;
            img.classList.toggle("hidden");
            main.classList.toggle("hidden");
        });

        img.addEventListener("mouseup", () => {
            img.classList.toggle("hidden");
            main.classList.toggle("hidden");
        });
    }

    if (uploadBtn != null)
        uploadBtn.addEventListener("click", () => {
            request.updatePostWithMedia(post.postId)
                .then(function (result) {
                    localStorage.removeItem("notes");
                })
                .catch(function (error) {
                    console.log("Error" + error);
                });
        });

    if (editBtn != null)
        editBtn.addEventListener("click", () => {
            if (img != null && !img.classList.contains("hidden")) return;

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

    if (deleteBtn != null)
        deleteBtn.addEventListener("click", () => {
            if (img != null && !img.classList.contains("hidden")) return;

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

function hasSelectedText() {
    if (window.getSelection)
    {
        return window.getSelection().isCollapsed == false;
    }
    if (document.getSelection) {
        return document.getSelection().isCollapsed == false;
    }
    else if (document.selection) {
        return !document.selection.createRange().text;
    }
    else return false;
}
