const WORD_LENGTH = 5; // How long each guess should be
const inputEl = document.querySelector('#guess-inp'); // The input DOM element

// Will store the correct answer once fetched
let correctAnswer = '';

// Before we have a set answer, disable the input field and show a loading message
inputEl.setAttribute('disabled', true);
showInfoMessage('Loading...');

// Get a random answer from the list
getRandomAnswer((answer) => {
    correctAnswer = answer;              // Once we have it, store it, ...
    inputEl.removeAttribute('disabled'); // enable the input field, ...
    clearInfoMessage();                  // clear the loading message, and...
    //inputEl.focus();                     // and focus the input field
});


// TODO: Fill in your code here
function displayGuessFeedback(guess) {

    // Create a div Element and add to "guess" class to it
    guess_div = document.createElement("div");
    guess_div.classList.add('guess');
    
    // Loop through every letter in the guess word
    for (let i = 0; i < guess.length; i++) {

        // Create a span element and add the class "letter" to it
        const spanElm = document.createElement('span');
        spanElm.classList.add('letter');

        // Extract the ith letter of the user guessed word
        const letter = guess[i].toUpperCase();
        // Extract the ith letter of the user correct word
        const correctLetter = correctAnswer[i].toUpperCase();

        // Check if the letter of the guessed word is the name as the the letter of the correct word
        if (letter === correctLetter) {
            spanElm.classList.add('correct');
        
        // If the given letter is present in the correct word, add the class "present" to the span element
        } else if (correctAnswer.toUpperCase().includes(letter)) {
            spanElm.classList.add('present');

        } else {
            spanElm.classList.add('absent');
        }

        // Include the letter in the span element
        spanElm.innerText = letter;

        // Append the span element with the given letter to the guessed word div
        guess_div.append(spanElm);
    }
    // Append the div with the guessed word to an existing div in the DOM
    existing_div = document.querySelector('#guesses');
    existing_div.append(guess_div);
}


inputEl.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter") {
        const user_guess = inputEl.value;
        if (user_guess.length !== WORD_LENGTH) {
            showInfoMessage(`Your guess must be ${WORD_LENGTH} letters long`);

        } else {
            if (user_guess === correctAnswer) {
                // Display win message
                showInfoMessage(`You win! The answer was ${correctAnswer}.`);

                // Disable input element - Game is over. 
                inputEl.setAttribute('disabled', true);

            } else {
                // Clear input element's value
                inputEl.value = "";

                // Check if the guess is a valid word
                if (isValidWord(user_guess, (isValid) => {
                    if (isValid) {
                        displayGuessFeedback(user_guess);

                    } else {
                        // DIsplay error message
                        showInfoMessage(`${user_guess} is not a valid word.`)
                    }
                })); 
            }
        }
    } else {
        clearInfoMessage();
    }
})
