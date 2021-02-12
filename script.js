const BASE_URL = 'https://damp-caverns-05420.herokuapp.com/https://xmeme-shaw8wit.herokuapp.com/memes';
const DEFAULT_IMAGE_URL = 'https://i.imgflip.com/265no1.jpg';

const URL = document.getElementById('url');
const FORM = document.querySelector('form');
const NAME = document.getElementById('name');
const OUTPUT = document.getElementById('output');
const CAPTION = document.getElementById('caption');

//Get the button:
const mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = scrollFunction;

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

const checkImage = (img) => {
    if (!(img.complete && typeof img.naturalWidth !== 'undefined' && img.naturalWidth !== 0)) {
        img.src = DEFAULT_IMAGE_URL;
    }
}

const checkAllImages = () => {
    document.querySelectorAll('img').forEach(img => checkImage(img));
}

const checkImageById = (id) => {
    const img = document.getElementById(id).querySelector('img');
    checkImage(img);
}


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
                    <input pattern="[a-zA-Z ]{2,}" type="text" class="has-text-centered input" name="caption"
                        placeholder="Be creative with the caption" autocomplete="off" value="${caption}">
                </div>
            </div>
        <div class="field">
            <label class="label" for="url">Meme URL</label>
                <div class="control">
                    <input type="url" class="has-text-centered input" name="url"
                        placeholder="Enter URL of your meme here" autocomplete="off" value="${url}">
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


const getMemeHolder = (name, caption, url, id) => {
    return `<div class="column is-4-desktop is-6-tablet">
                <div class="card meme" id="${id}">
                    ` + getMemeBody(name, caption, url, id, false) + `
                </div>
            </div>`;
}


const editMeme = async (id) => {
    const meme = document.getElementById(id);
    const isEditableNow = meme.querySelector('.button .icon .fa').classList.contains('fa-edit');
    meme.querySelector('.card-footer-item').innerHTML = `<progress class="progress is-dark" max="100">45%</progress>`;
    let caption, url, name;
    if (isEditableNow) {
        await fetch(`${BASE_URL}/${id}`)
            .then(response => response.json())
            .then(data => {
                name = data.name;
                caption = data.caption;
                url = data.url;
            });
    } else {
        name = meme.querySelector('.card-header-title').innerText;
        caption = meme.querySelector('input[name="caption"]').value;
        url = meme.querySelector('input[name="url"]').value;
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
                    caption: caption,
                    url: url,
                })
            });
        }
    }
    meme.innerHTML = getMemeBody(name, caption, url, id, isEditableNow);
    setTimeout(() => checkImageById(id), 1500);
}


const getMemes = () => {
    OUTPUT.innerHTML = `<progress class="m-6 p-3 progress is-large is-info is-10" max="100">45%</progress>`;
    let result = '';
    fetch(BASE_URL)
        .then(response => response.json())
        .then(data => {
            data.forEach(e => result = result.concat(getMemeHolder(e.name, e.caption, e.url, e.id)));
            OUTPUT.innerHTML = result;
            setTimeout(checkAllImages, 1500);
        });
};



const saveMeme = () => {
    fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: NAME.value,
                caption: CAPTION.value,
                url: URL.value,
            })
        })
        .then(response => getMemes());

    FORM.reset();
    return false;
}


document.addEventListener("DOMContentLoaded", getMemes);