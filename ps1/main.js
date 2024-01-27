let score = 0;

// Write code that *every second*, picks a random unwhacked hole (use getRandomUnwhackedHoleId)
// and adds the "needs-whack" class
const interval = setInterval(() => {
    
    // Call getRandomUnwhackedHoleId to collect the hole id and change class name EVERY SECOND
    document.getElementById(getRandomUnwhackedHoleId()).className += " needs-whack";
}, 1000);

for(const id of getAllHoleIds()) {
    // Write code that adds a "click" listener to the element with this id
    //     When the user clicks on it, *if* the element has class "needs-whack" then:
    //          1. Remove the "needs-whack" class
    //          2. Add the "animating-whack" class *for 500 milliseconds*
    //          3. Increment the score by 1 (and update the score display)
    //          4. If the score is 45 or higher, stop the game (by clearing the interval)

    // Create a variable to store the hole element
    const element_value = document.getElementById(id);
    
    element_value.addEventListener("click", () => {
        
        if(element_value.classList.contains("needs-whack")) {
            
            // Remove "needs-whack" class
            element_value.classList.remove("needs-whack");
            

            // Add the "animating-whack" class
            element_value.classList.add("animating-whack");

            // Remove the "animating-whack" class for 500 milliseconds
            setTimeout(() => element_value.classList.remove("animating-whack"), 500);

            // Increment score
            score++;
            // Update the score display
            document.getElementById("score").innerText = "Score: " + score;

            // Stop the game when score is greater or equal to 45
            if(score >= 45) {
                clearInterval(interval);
            }
        }
    })
}

/**
 * @returns a random ID of a hole that is "idle" (doesn't currently contain a mole/buckeye). If there are none, returns null
 */
function getRandomUnwhackedHoleId() {
    const inactiveHoles = document.querySelectorAll('.hole:not(.needs-whack)');  // Selects elements that have class "hole" but **not** "needs-whack"

    if(inactiveHoles.length === 0) {
        return null;
    } else {
        const randomIndex = Math.floor(Math.random() * inactiveHoles.length);
        return inactiveHoles[randomIndex].getAttribute('id');
    }
}

/**
 * @returns a list of IDs (as strings) for each hole DOM element
 */
function getAllHoleIds() {
    const allHoles = document.querySelectorAll('.hole'); 
    const ids = [];
    for(const hole of allHoles) {
        ids.push(hole.getAttribute('id'));
    }
    return ids;
}