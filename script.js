const url = document.getElementById('url');
const form = document.querySelector('form');
const output = document.getElementById('output');
const username = document.getElementById('name');
const caption = document.getElementById('caption');

//Get the button:
mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
    scrollFunction()
};

function scrollFunction() {
    if (document.body.scrollTop > 420 || document.documentElement.scrollTop > 420) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

const getMemeHolder = (name, caption, url, id) => {
    return `<div class="column is-4-desktop is-6-tablet">
                <div class="card meme" id="${id}">
                    <header class="card-header">
                        <h3 class="card-header-title is-size-5">${name}</h3>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            <h1 class="subtitle is-size-5-tablet is-size-6-mobile m-0 has-text-weight-normal">${caption}</h1>
                        </div>
                    </div>
                    <div class="card-image">
                        <figure class="image is-5by4">
                            <img src="${url}" alt="${name}:${caption}">
                        </figure>
                    </div>
                    <footer class="card-footer">
                        <button onclick="editMeme(${id})" class="button card-footer-item">
                            <span class="icon">
                                <i class="fa fa-edit"></i>
                            </span>&nbsp;
                            Edit
                        </button>
                    </footer>
                </div>
            </div>`;
}

const editMeme = (e) => {
    const meme = document.getElementById(e);
    const button = meme.querySelector('.button');
    if (button.querySelector('.icon .fa').classList.contains('fa-edit')) {
        button.innerHTML = `<span class="icon">
                                <i class="fa fa-save"></i>
                            </span>&nbsp;
                            Save`;
    } else {
        button.innerHTML = `<span class="icon">
                                <i class="fa fa-edit"></i>
                            </span>&nbsp;
                            Edit`;
    }
    button.classList.toggle('is-dark');
}

const checkImage = (url) => {
    var image = new Image();
    image.onload = function () {
        if (this.width > 0) {
            console.log("image exists");
        }
    }
    image.onerror = function () {
        console.log("image doesn't exist");
    }
    image.src = url;
}

const getMemes = () => {
    let result = '';
    fetch('https://damp-caverns-05420.herokuapp.com/https://xmeme-shaw8wit.herokuapp.com/memes')
        .then(response => response.json())
        .then(data => {
            data.forEach(e => result = result.concat(getMemeHolder(e.name, e.caption, e.url, e.id)));
            output.innerHTML = result;
        });
};



const saveMeme = () => {

    fetch('https://damp-caverns-05420.herokuapp.com/https://xmeme-shaw8wit.herokuapp.com/memes', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: username.value,
                caption: caption.value,
                url: url.value,
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            getMemes();
        });

    form.reset();
    return false;
}


document.addEventListener("DOMContentLoaded", getMemes);