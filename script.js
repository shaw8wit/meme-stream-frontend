// deployed backend url
const BACKEND_URL = 'https://xmeme-shaw8wit.herokuapp.com/memes';

// redirected base url for removing CORS error
const BASE_URL = 'https://damp-caverns-05420.herokuapp.com/' + BACKEND_URL;

// Default image if url provided is not an image:
const DEFAULT_IMAGE_URL = 'https://i.imgflip.com/265no1.jpg';

const URL = document.getElementById('url');
const FORM = document.querySelector('form');
const NAME = document.getElementById('name');
const OUTPUT = document.getElementById('output');
const CAPTION = document.getElementById('caption');
const mybutton = document.getElementById("myBtn");

// calls [scrollFunction] when the page is scrolled
window.onscroll = scrollFunction;

// displays the {top} button if page scrolled below 420px
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

// checks if the image url is actually an image, if not then default is used
const checkImage = (img) => {
    if (!(img.complete && typeof img.naturalWidth !== 'undefined' && img.naturalWidth !== 0)) {
        img.src = DEFAULT_IMAGE_URL;
    }
}

// checks the images for the entire page
const checkAllImages = () => {
    document.querySelectorAll('img').forEach(img => checkImage(img));
}

// checks the image of a single element
const checkImageById = (id) => {
    checkImage(document.getElementById(id).querySelector('img'));
}

// returns the meme body depending on its [isEditable] status
const getMemeBody = (name, caption, url, id, isEditable) => {
    return `<header class="card-header">
                <h3 class="card-header-title is-size-5">${name}</h3>
            </header>
            <div class="card-content p-4">
                <div class="content">` + (
        isEditable ?
        `<div class="field">
            <label class="label" for="caption">Caption</label>
                <div class="control">
                    <input type="text" class="has-text-centered input" name="caption" value="${caption}"
                        placeholder="Be creative with the caption" autocomplete="off">
                </div>
            </div>
        <div class="field">
            <label class="label" for="url">Meme URL</label>
                <div class="control">
                    <input type="url" class="has-text-centered input" name="url" value="${url}"
                        placeholder="Enter URL of your meme here" autocomplete="off">
                </div>
        </div>` :
        `<h1 class="subtitle is-size-5-tablet is-size-6-mobile m-0 has-text-weight-normal">${caption}</h1>`
    ) + `</div>
    </div>` + (
        isEditable ?
        `` :
        `<div class="card-image">
            <figure class="image is-5by4">
                <img src="${url}" alt="${name} : ${caption}">
            </figure>
        </div>`
    ) + `
        <footer class="card-footer">
            <button onclick="editMeme(${id})" class="button ` + (
        isEditable ?
        'is-link is-outlined' :
        'is-primary is-light'
    ) + ` card-footer-item">
            <span class="icon">
                <i class="fa fa-` + (isEditable ? 'save' : 'edit') + `"></i>
            </span>&nbsp;
            ` + (isEditable ? 'Save' : 'Edit') + `
        </button>
    </footer>`;
}

// returns the meme body with its holder
const getMemeHolder = (name, caption, url, id) => {
    return `<div class="column is-4-desktop is-6-tablet">
                <div class="card meme" id="${id}">
                    ` + getMemeBody(name, caption, url, id, false) + `
                </div>
            </div>`;
}

// works with the edits made on a meme
const editMeme = async (id) => {
    const meme = document.getElementById(id); // gets the required meme
    // checks if the meme is editable
    const isEditableNow = meme.querySelector('.button .icon .fa').classList.contains('fa-edit');
    // adds progress bar to the footer of meme body
    meme.querySelector('.card-footer-item').innerHTML = `<progress class="progress is-dark" max="100">45%</progress>`;
    let caption, url, name;
    if (isEditableNow) {
        // fetches the details of the required meme
        await fetch(`${BASE_URL}/${id}`)
            .then(response => response.json())
            .then(data => {
                name = data.name;
                caption = data.caption;
                url = data.url;
            });
    } else {
        // gets the edited details
        name = meme.querySelector('.card-header-title').innerText;
        caption = meme.querySelector('input[name="caption"]').value;
        url = meme.querySelector('input[name="url"]').value;
        // if any of the fields are set to empty then no change is made else PATCH request sent
        if (!caption.length || !url.length) {
            await fetch(`${BASE_URL}/${id}`)
                .then(response => response.json())
                .then(data => {
                    name = data.name;
                    caption = data.caption;
                    url = data.url;
                });
        } else {
            fetch(`${BASE_URL}/${id}`, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    caption: caption.substr(0, 200),
                    url: url.substr(0, 300),
                })
            });
        }
    }
    // finally get the body of the edited meme
    meme.innerHTML = getMemeBody(name, caption, url, id, isEditableNow);
    // check the image of the current meme
    if (!isEditableNow) setTimeout(() => checkImageById(id), 1500);
}

// gets all memes from the server
const getMemes = () => {
    // adds progress bar to the main page
    OUTPUT.innerHTML = `<progress class="m-6 p-3 progress is-large is-info is-10" max="100">45%</progress>`;
    let result = '';
    fetch(BASE_URL)
        .then(response => response.json())
        .then(data => {
            // all meme holders are stored to [result]
            data.forEach(e => result = result.concat(getMemeHolder(e.name, e.caption, e.url, e.id)));
            OUTPUT.innerHTML = result;
            // check all the fetched meme images
            setTimeout(checkAllImages, 1500);
        });
};

// saves the memes submitted through the main form
const saveMeme = () => {
    // post the meme and refresh the memes on page
    fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: NAME.value.substr(0, 100),
                caption: CAPTION.value.substr(0, 200),
                url: URL.value.substr(0, 300),
            })
        })
        .then(response => getMemes());
    // clear the form and return false to avoid redirect
    FORM.reset();
    return false;
}

// fetches all the memes on page load
document.addEventListener("DOMContentLoaded", getMemes);