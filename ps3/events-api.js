function getUMEvents(callback) {
    const options = {};
    const params = new URLSearchParams(Object.assign({
        v: 2,
    }, options));
    const url = `https://events.umich.edu/day/json?${params}`;

    fetch(url).then(response => response.json())
              .then(data => callback(data));
}

function getUMEventsWithImages(callback) {
    getUMEvents((eventData) => {
        const eventsWithImages = eventData.filter(event => event.image_url);
        callback(eventsWithImages);
    });
}

function getReadableTime(dateString) {
    // Parsing the string to a Date object
    const year = parseInt(dateString.substring(0, 4), 10);
    const month = parseInt(dateString.substring(4, 6), 10) - 1; // Months are 0-indexed in JavaScript
    const day = parseInt(dateString.substring(6, 8), 10);
    const hour = parseInt(dateString.substring(9, 11), 10);
    const minute = parseInt(dateString.substring(11, 13), 10);
    const second = parseInt(dateString.substring(13, 15), 10);

    const dateObj = new Date(year, month, day, hour, minute, second);

    const localizedString = dateObj.toLocaleString(); // You can pass locale and options if needed
    return localizedString;
}