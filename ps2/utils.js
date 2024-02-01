/**
 * Display a message on the page.
 * 
 * @param {string} message - The message to be displayed.
 */
function showInfoMessage(message) {
    // Find the DOM element with ID 'info-message'
    const infoElement = document.querySelector('#info-message');
    // Set the text content to the provided message
    infoElement.innerText = message;
    // Remove the 'hidden' class, making the element visible
    infoElement.classList.remove('hidden');
}

function clearInfoMessage() {
    // Find the DOM element with ID 'info-message'
    const infoElement = document.querySelector('#info-message');
    // Clear the text content of the element
    infoElement.innerText = '';
    // Add the 'hidden' class, making the element invisible
    infoElement.classList.add('hidden');
}

/**
 * Checks if a given word exists in a predefined wordlist.
 * 
 * @param {string} word - The word to be checked.
 * @param {function} callback - The callback function to be executed with the result.
 */
function isValidWord(word, callback) {
    const lowercaseWord = word.toLowerCase(); // Convert the word to lowercase
    // Fetch the list of valid words
    const f = fetch("./wordle-wordslist/wordlist.txt"); // Uses the Fetch API (https://developer.mozilla.org/en-US/docs/Web/API/fetch)
    f.then((response) => {
        return response.text(); // Get the text content from the fetched file
    }).then((text) => {
        const wordEl = text.split("\n").find((line) => line === lowercaseWord); // Find the word in the list
        const hasWord = wordEl !== undefined; // true if the word exists in the list, false otherwise
        callback(hasWord); // Execute the callback with true or false
    }, (error) => {
        console.error(error);
    });
}

/**
 * Get a random word (answer) from a predefined list.
 * 
 * @param {function} callback - The callback function to be executed with the random word.
 */
function getRandomAnswer(callback) {
    // Fetch the answer list
    const f = fetch("./wordle-wordslist/answerlist.txt"); // Uses the Fetch API (https://developer.mozilla.org/en-US/docs/Web/API/fetch)
    f.then((response) => {
        return response.text(); // Get the text content from the fetched file
    }).then((text) => {
        const lines = text.split("\n"); // Split the text by newline to get individual lines
        const randomLine = lines[Math.floor(Math.random() * lines.length)]; // Get a random line from the list
        callback(randomLine); // Execute the callback with the random word
    }, (error) => {
        console.error(error);
    });
}