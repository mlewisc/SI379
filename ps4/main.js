fetch('https://the-trivia-api.com/v2/questions', {})
    .then((response) => response.json()) // Parse the JSON data from the response
    .then((alldata) => {startTrivia(alldata)});

let current_score = 0;
let total_answered = 0;
let num_questions = 0;

const play_again_button = document.querySelector("#play-again");
const close_button = document.querySelector("#close");

// Reload the page to restart the game if the user clicks this button
play_again_button.addEventListener('click', () => {
    window.location.reload();
});

// Close the modal if the user clicks this button
close_button.addEventListener('click', () => {
    document.querySelector('.modal-background').style.display = "none";
});

// Close the modal if the user clicks on the background
document.querySelector('.modal-background').addEventListener('click', () => {
    document.querySelector('.modal-background').style.display = "none";
});


function startTrivia(alldata) {
    
    for(const data of alldata){

        // Extract the question and answer from the JSON data object
        const question = data.question.text;
        const correct_answer = data.correctAnswer;
        const incorrect_answers = data.incorrectAnswers;

        // Create a list with all the answers
        const answers_list = [correct_answer, ...incorrect_answers];

        // Select a random number
        const correct_answer_index = Math.floor(Math.random() * 4);
        // Place a random answer in the first spot of the list
        answers_list[0] = answers_list[correct_answer_index];
        // Place the correct answer in a random positon
        answers_list[correct_answer_index] = correct_answer;

        questionBuilder(question, answers_list, correct_answer_index);

        // Increment the questions number
        num_questions++;        
    }

}

function questionBuilder(question, answers, correct_answer_index) {
    // Query question_list
    const question_list = document.querySelector('.question-list');

    // Create container to hold question data
    const question_box = document.createElement('div');
    question_box.classList.add("question-box");

    // Create header that contains question text
    const question_text = document.createElement('h2');
    question_text.innerHTML = question;

    // Append the question text box to the question container
    question_box.append(question_text);

    // Create container to hold the answers 
    const answers_box = document.createElement('div');
    answers_box.classList.add("answers-box");

    // Loop through the answers to create an element that holds them and append to the DOM
    for(const answer of answers) {
        const answer_button = document.createElement('button');
        answer_button.classList.add('answer');

        answer_button.innerHTML = answer;
        // When the user clicks an answer, call answerClick
        answer_button.addEventListener('click', () => answerClick(answers_box, answer_button, answer === answers[correct_answer_index]))
        if(answer === answers[correct_answer_index]) {
            answer_button.classList.add('correct-answer');
        }

        answers_box.append(answer_button);
    }
    // Add an id to the question box to create an anchor point
    question_box.setAttribute('id', `question-${num_questions}`);
    // Add container with the answers to the question box
    question_box.append(answers_box);
    // Add question-box to the DOM (question_list)
    question_list.append(question_box);
}


function answerClick(answers_box, selected_button, is_correct_answer) {
    
    // Query the span elements that hold the scores
    const current_score_elem = document.querySelector('#current-score');
    const total_score_elem = document.querySelector('#total-answered');

    // Increase the total score every time a click happens
    total_answered++;
    // Update the total score in the DOM
    total_score_elem.innerHTML = total_answered;

    // If the clicked button holds the correct answer:
    if(is_correct_answer) {
        // Increase the current score and update the number in the DOM
        current_score++;
        current_score_elem.innerHTML = current_score;
    }

    // Disabled all buttons and add the "answered" class to match the disabled state
    const answer_buttons = answers_box.querySelectorAll('button');
    for(const button of answer_buttons) {
        button.setAttribute('disabled', 'true');
        button.classList.add('answered');

        if(button.classList.contains('correct-answer')) {
            button.classList.remove('answered');
            button.classList.add('green');
        }
    }
    // If the answer is not correct, add the red class
    if(!is_correct_answer) {
        selected_button.classList.remove('answered');
        selected_button.classList.add('red');
    }

    // After .5 seconds, scroll to the immediate next question
    setTimeout(()=>{
        document.querySelector(`#question-${total_answered}`).scrollIntoView({behavior: 'smooth', block: 'center'});
    }, 500);

    // Display the end of game modal
    if(total_answered === 10) {
        document.querySelector('.modal-background').style.display = "block";
        // Update user's final score
        document.querySelector('#final-score').innerHTML = current_score;
    }

}