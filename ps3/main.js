const INTERVAL_TIME = 10000;

const thumbElm = document.querySelector("#thumbnails");
const displayElm = document.querySelector("#selected");
const title = document.querySelector('#selected-title');
const image = document.querySelector('#selected-image');
const date = document.querySelector('#selected-date');
const description = document.querySelector('#selected-description');

let umEvents;
let timerId;
// Keep track of the ID of the current selected thumbnail
let currentSelectedId;

function showSelectedInfo(selectedId) {
    // Collect the event image source and add to the DOM
    image.src = umEvents[selectedId].image_url;
    
    // Collect the event title and direct link and add to the DOM
    title.innerText = umEvents[selectedId].event_title;
    title.href = umEvents[selectedId].permalink;
    
    // Collect the event date, convert time, and add to the DOM
    date.innerText = getReadableTime(umEvents[selectedId].datetime_start);
    
    // Collect event description and add to the DOM
    description.innerText = umEvents[selectedId].description;
}

function updateSelected(newSelectedId) {
    if (currentSelectedId != undefined) {
        // Query the current selected thumbnail
        const current_img = document.querySelector(`#n${currentSelectedId}`);
        // Remove the selected from the current thumbnail
        current_img.classList.remove('selected');
    }
    
    // Query the next thumbnail image
    const next_img = document.querySelector(`#n${newSelectedId}`);
    
    // Add selected class to the next thumbnail image
    next_img.classList.add('selected');

    showSelectedInfo(newSelectedId);

    // Ensure continuity after every 10 secs.
    currentSelectedId = newSelectedId;
}

function startInterval(selectedId) {
    updateSelected(selectedId);

    timerId = setTimeout(() => {
        // Increment the image ID
        let nextId = currentSelectedId + 1;
        // Set ID to the first item in the carousel if reached the last image
        if(nextId === thumbElm.length) {
            nextId = 0;
        }
        startInterval(nextId);
    }, INTERVAL_TIME);
}

function setupPage(events) {
    umEvents = events;
    const totalEvents = events.length;

    for(let i = 0; i < totalEvents; i++) {
        // Create an image element
        const img_elm = document.createElement('img');

        // Set an image id to keep track of the image position
        img_elm.id = `n${i}`

        img_elm.addEventListener("click", (e) => {
            let imgId = Number(e.target.id.match(/\d+/)[0]);
            clearTimeout(timerId);
            startInterval(imgId);
        });

        // Add the image source to the image element and add element to the thumbnail area in the DOM
        img_elm.src = events[i].styled_images.event_thumb;
        thumbElm.append(img_elm);
    }
    startInterval(0);
}

getUMEventsWithImages(setupPage);
