import chroma from 'chroma-js';
import { getBinomialProbability } from './utils.js';


const BALL_COLOR = "#2F65A7";     // The color of the balls: [Arboretum Blue](https://brand.umich.edu/design-resources/colors/)

let NUM_BALLS = 10;              // The number of balls to drop
const GRAPH_HEIGHT = 300;          // The maximum height of the graph (in pixels)
const BALL_RADIUS = 10;            // The radius of the balls (in pixels)
const PEG_RADIUS = 3;              // The radius of the pegs (in pixels)
const X_MOVEMENT = 30;             // The horizontal distance between pegs (in pixels)
const Y_MOVEMENT = 20;             // The vertical distance between pegs (in pixels)
const DELAY_BETWEEN_BALLS = 1000;  // How long to wait between dropping balls (in milliseconds)
const DELAY_BETWEEN_PEGS  = 1000;  // How long it takes for a ball to drop from one peg to the next (in milliseconds)
const DELAY_WHEN_DROP     = 3000;  // How long it takes for the ball to "fall" into the hole (in milliseconds)
let PROBABILITY_RIGHT = 0.5;     // The probability of a ball going right (as opposed to left)

const PADDING = Math.max(PEG_RADIUS, BALL_RADIUS, X_MOVEMENT/2) + 5; // The padding around the edge of the SVG element (in pixels)

const svgElement      = document.querySelector('svg');         // The parent SVG container
const numLevelsInput  = document.querySelector('#num-levels'); // The input for the number of levels
const dropBallsButton = document.querySelector('#do-drop');    // The button to drop the balls
const speedInput      = document.querySelector('#speed');      // The input for the speed of the animation

const numBallsInput   = document.querySelector('#num-balls');  // The input for the number of balls
const rightProbInput  = document.querySelector('#right-prob'); // The input for the rightward probability

const pegs = []; // A 2D array of pegs (each peg is a circle element)
const actualBars = []; // An array of the number of balls that actually hit each bar
const expectedBars = []; // An array of the expected number of balls that hit each bar

const pegColorScale = chroma.scale(['#e4ecf5', BALL_COLOR, 'black']); // Create a color scale for the pegs



function drawBoard() {
    Array.from(svgElement.children).forEach(child => child.remove()); // Remove all the children of the SVG element

    const NUM_LEVELS = parseInt(numLevelsInput.value); // How many levels of pegs to have

    const TOTAL_WIDTH  = (NUM_LEVELS-1) * X_MOVEMENT + 2 * PADDING;                // The total width of the SVG element (in pixels)
    const TOTAL_HEIGHT = (NUM_LEVELS-1) * Y_MOVEMENT + 2 * PADDING + GRAPH_HEIGHT; // The total height of the SVG element (in pixels)

    // Some math to estimate the highest probability in a [binomial distribution](https://en.wikipedia.org/wiki/Binomial_distribution)
    const MODE = Math.round((NUM_LEVELS-1) * PROBABILITY_RIGHT); // The mode (most probable outcome) of the binomial distribution
    const maxProb = getBinomialProbability(NUM_LEVELS-1, MODE, PROBABILITY_RIGHT); // The estimated maximum probability
    const BAR_SCALE_FACTOR = 0.5 * GRAPH_HEIGHT / maxProb; // The scale factor for the bars

    svgElement.setAttribute('width', TOTAL_WIDTH);
    svgElement.setAttribute('height', TOTAL_HEIGHT); // Set the width and height of the SVG element

    const hitCounts = []; // A 2D array of the number of balls that hit each peg

    for(let level = 0; level < NUM_LEVELS; level++) {
        const rowHitCounts = []; // The hit counts in this row
        hitCounts.push(rowHitCounts);

        const rowPegs = []; // The pegs in this row
        pegs.push(rowPegs);

        for(let i = NUM_LEVELS - level - 1; i <= NUM_LEVELS + level - 1; i+=2) {
            hitCounts[level][i] = 0; // Initialize the hit count for this peg at 0

            const { x, y } = getGraphicLocation(i, level);
            const circle = createCircle(x, y, PEG_RADIUS, '#FEFEFE', 'none', svgElement);
            if(level === 0) {
                circle.setAttribute('fill', pegColorScale(1)); // The top peg is always filled in
            }

            pegs[level][i] = circle; // Store the peg in the 2D array
        }
    }

    // Draw the bars for the expected and actual probabilities
    for(let i = 0; i < 2*NUM_LEVELS-1; i+=2) { // The last row has columns 0, 2, 4, 6, etc. (so we only need to loop through every other column)
        const { x, y } = getGraphicLocation(i, NUM_LEVELS-1);

        const barY = y + PEG_RADIUS + 2; // The y coordinate of the top of the bar (just below the peg)

        const actualBar = createRect(x - X_MOVEMENT/2, barY, X_MOVEMENT, 0, BALL_COLOR, 'none', svgElement); // Create a new rectangle for the number of balls that actually hit
        actualBars.push(actualBar);

        const prob = getBinomialProbability(NUM_LEVELS-1, Math.floor(i/2), PROBABILITY_RIGHT); // The binomial probability of getting hit
        const expectedBar = createRect(x - X_MOVEMENT/2, barY, X_MOVEMENT, BAR_SCALE_FACTOR * prob, 'rgba(0, 0, 0, 0.1)', BALL_COLOR, svgElement); // Create a new rectangle for the expected number of balls that hit
        expectedBars.push(expectedBar);
    }

    async function dropBall() {
        let row = 0; // Start at the top row
        let col = NUM_LEVELS - 1; // Start in the middle column

        // Create a random number between -2 and 2
        const darkNum = (2*Math.random() - 1) * 2; 
        const satNum = (2*Math.random() - 1) * 2;
        // Change the ball color using darken and saturate
        const ball_color = chroma(BALL_COLOR).darken(darkNum).saturate(satNum);
        
        const { x, y } = getGraphicLocation(col, row);
        const circle = createCircle(x, y, BALL_RADIUS, ball_color, BALL_COLOR, svgElement); // Create a new circle at the top of the board
        circle.setAttribute('opacity', 0.9); // Make the circle slightly transparent (so we can see the pegs it passes through)


        // Drop the ball down the board by looping down the rows and randomly choosing left or right
        for(let i = 0; i < NUM_LEVELS-1; i++) {
            row++; // The row is always incremented

            if(Math.random() < PROBABILITY_RIGHT) { // If the random number is less than the probability of going right, go right
                col++; // Go right
            } else {
                col--; // Go left
            }

            const { x, y } = getGraphicLocation(col, row); // The new location of the ball (in pixels)
            await moveCircleTo(circle, x, y, DELAY_BETWEEN_PEGS / parseFloat(speedInput.value)); // Move the ball to the new location


            const peg = pegs[row][col]; // The peg that the ball hit
            hitCounts[row][col]++; // Increment the hit count for this peg

            // Create the scale number of what color to make the peg
            const scaleNum = hitCounts[row][col]/NUM_BALLS;
            
            peg.setAttribute('fill', pegColorScale(scaleNum)); // Change the color of the peg to indicate that it was hit
        }



        const finalColHitCount = hitCounts[NUM_LEVELS-1][col]; // The hit count for the final column
        const barIndex = Math.floor(col/2); // The index of the bar that corresponds to the final column (since there are 2 pegs per bar)
        const newBarHeight = BAR_SCALE_FACTOR * finalColHitCount / NUM_BALLS; // The new height of the bar
        const heightAnimPromise = changeHeightTo(actualBars[barIndex], newBarHeight, DELAY_WHEN_DROP / parseFloat(speedInput.value)); // Animate the change in height of the bar
        const circleAnimPromise = animateLastPosition(circle, DELAY_WHEN_DROP / parseFloat(speedInput.value)); //
        await Promise.all([heightAnimPromise, circleAnimPromise]);

        circle.remove(); // Remove the circle from the SVG element
    }

    async function dropBalls() {
        redrawBoard(); // Redraw the board to clear the results

        // Disable the inputs and button while the balls are dropping
        dropBallsButton.setAttribute('disabled', true);
        numLevelsInput.setAttribute('disabled', true);
        numBallsInput.setAttribute('disabled', true);
        rightProbInput.setAttribute('disabled', true);

        const dropBallPromises = []; // An array of promises for each ball that is dropped
        for(let i = 0; i < NUM_BALLS; i++) {
            const ballDropPromise = dropBall(); // Drop a ball
            await pause(Math.random() * DELAY_BETWEEN_BALLS / parseFloat(speedInput.value)); // Wait a random amount of time before dropping the next ball
            dropBallPromises.push(ballDropPromise); // Add the promise to the array
        }

        await Promise.all(dropBallPromises); // Wait for all the balls to be dropped

        // Re-enable the inputs and button after the balls are done dropping
        dropBallsButton.removeAttribute('disabled');
        numLevelsInput.removeAttribute('disabled');
        numBallsInput.removeAttribute('disabled');
        rightProbInput.removeAttribute('disabled');
    }

    dropBallsButton.addEventListener('click', dropBalls); // When the button is clicked, drop the balls

    // Return a function that cleans up the board
    function cleanup() {
        expectedBars.forEach(bar => bar.remove()); // Remove the "expected" bars
        expectedBars.splice(0, expectedBars.length); // ...and clear the array

        actualBars.forEach(bar => bar.remove()); // Remove the "actual" bars
        actualBars.splice(0, actualBars.length); // ...and clear the array

        pegs.forEach(row => row.forEach(peg => peg.remove())); // Remove the pegs
        pegs.splice(0, pegs.length); // ...and clear the array

        dropBallsButton.removeEventListener('click', dropBalls); // Remove the event listener (we will re-add it when we redraw the board)
    }

    return cleanup; // Return the cleanup function
}


// Animates the height of a rectangle from its current height to a new height
async function changeHeightTo(rect, toHeight, duration) {

    const startHeight = parseInt(rect.getAttribute('height'));

    // Determine the start of the animation
    const animationStarted = Date.now();

    const step = () => {
        const now = Date.now();

        // Calculate what percentage of TIME completed
        const pct = (now - animationStarted) / duration;
        // Calculate the multiplier of how far the rectangle should move (change in position)
        const pos = easeInQuad(pct);

        // Change the height value
        const height = startHeight + pos * (toHeight - startHeight);

        // Update the height attribute value
        rect.setAttribute('height', height);

        // Call requestAnimationFrame until the end time 
        if(now <= animationStarted + duration) {
            requestAnimationFrame(step);
        }
    }
    // Start the animation
    step();
    // Wait until the animation runs for the rectangle
    await pause(duration);
}

// Animate the ball once it hits its last position
async function animateLastPosition(circle, duration) {

    // Collect the current position and opacity
    const initalPostion = parseInt(circle.getAttribute('cy'));
    const initalOpacity = parseFloat(circle.getAttribute('opacity'));
    // Define the final position (20px downward)
    const finalPosition = initalPostion + 20;
    
    // Determine the start of the animation
    const animationStarted = Date.now();

    const step = () => {
        const now = Date.now();

        // Calculate what percentage of TIME completed
        const pct = (now - animationStarted) / duration;
        // Calculate the multiplier of how far the circle should move (change in position)
        const pos = easeOutQuad(pct);

        // Change the position value
        const yPosition = initalPostion + pos * (finalPosition - initalPostion);
        // Change the opacity value
        const opacity = initalOpacity - pct * (initalOpacity);

        // Update the height attribute value
        circle.setAttribute('cy', yPosition);
        // Update the opacity attribute value
        circle.setAttribute('opacity', opacity);

        // Call requestAnimationFrame until the end time 
        if(now <= animationStarted + duration) {
            requestAnimationFrame(step);
        }
    }
    
    // Start the animation
    step();

    // Wait until the animation runs for the circle
    await pause(duration);
}
    


// Animates the movement of a circle to a new location
async function moveCircleTo(circle, cx, cy, duration) {
    
    // Collect the current X and Y position 
    const startCX = parseInt(circle.getAttribute('cx'));
    const startCY = parseInt(circle.getAttribute('cy'));

    // Determine the start of the animation
    const animationStarted = Date.now();

    const step = () => {
        const now = Date.now();

        // Calculate what percentage of TIME completed
        const pct = (now - animationStarted) / duration;
        // Calculate the multiplier of how far the circle should move (change in position)
        const pos = easeOutQuad(pct);

        // Change X and Y position value
        const x = startCX + pos * (cx - startCX);
        const y = startCY + pos * (cy - startCY);

        // Update cx and cy attribute values
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);

        // Call requestAnimationFrame until the end time 
        if(now <= animationStarted + duration) {
            requestAnimationFrame(step);
        }
    }
    // Start the animation
    requestAnimationFrame(step);

    // Wait until the animation runs for the circle
    await pause(duration);
};


/**
 * Translates a column and row into a pixel location
 * 
 * @param {number} col The column of the peg (0 is the leftmost peg)
 * @param {number} row The row of the peg (0 is the topmost peg)
 * @returns {Object} An object with x and y properties representing the location of the peg in pixels
 */
function getGraphicLocation(col, row) {
    return {
        x: PADDING + col * (X_MOVEMENT/2),
        y: PADDING + row *  Y_MOVEMENT
    };
}

/**
 * Returns a promise that resolves after the given number of milliseconds
 * 
 * @param {number} ms The number of milliseconds to pause
 * @returns A promise that resolves after the given number of milliseconds
 */
function pause(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Creates a rectangle and appends it to the parent SVG element
 * 
 * @param {number} x The x coordinate of the top left corner of the rectangle
 * @param {number} y The y coordinate of the top left corner of the rectangle
 * @param {number} width The width of the rectangle
 * @param {number} height The height of the rectangle
 * @param {string} fill The fill color of the rectangle
 * @param {string} stroke The stroke color of the rectangle
 * @param {SVGElement} parent The parent SVG element
 * @returns 
 */
function createRect(x, y, width, height, fill, stroke, parent) {
    // Create a new rectangle element using the SVG namespace
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', width);
    rect.setAttribute('height', height);
    rect.setAttribute('fill', fill);
    rect.setAttribute('stroke', stroke);
    parent.append(rect);
    return rect;
}

/**
 * Creates a circle and appends it to the parent SVG element
 * 
 * @param {number} cx The x coordinate of the center of the circle
 * @param {number} cy The y coordinate of the center of the circle
 * @param {number} r The radius of the circle
 * @param {string} fill The fill color of the circle
 * @param {string} stroke The stroke color of the circle
 * @param {SVGElement} parent The parent SVG element
 * @returns A new circle element
 */
function createCircle(cx, cy, r, fill, stroke, parent) {
    // Create a new circle element using the SVG namespace
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', r);
    circle.setAttribute('fill', fill);
    circle.setAttribute('stroke', stroke);
    parent.append(circle);
    return circle;
}

// When we change any of the parameter inputs, redraw the board
numLevelsInput.addEventListener('input', redrawBoard);
numBallsInput.addEventListener('input', redrawBoard);
rightProbInput.addEventListener('input', redrawBoard);

let clearBoard = drawBoard(); // Draw the board initially (and store the cleanup function)

/**
 * Redraws the board (by calling the cleanup function and then drawing the board again)
 */
function redrawBoard() {
    clearBoard(); // Clean up the old board

    // Update rightward probability according to users input
    PROBABILITY_RIGHT = parseFloat(rightProbInput.value);

    // Update the number of balls as the user changes the input value
    NUM_BALLS = parseInt(numBallsInput.value);

    clearBoard = drawBoard(); // Draw the new board (and store the cleanup function)
}

function easeOutQuad(t) { return t*(2-t); }
function easeInQuad(t) { return t*t; }
