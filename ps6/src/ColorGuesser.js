import './ColorGuesser.css';
import Slider from './Slider';
import React from "react";

const MIN = 0;
const MAX = 255;

function App() {
  const [red, setRed]     = React.useState(getRandomIntegerBetween(MIN, MAX));
  const [green, setGreen] = React.useState(getRandomIntegerBetween(MIN, MAX));
  const [blue, setBlue]   = React.useState(getRandomIntegerBetween(MIN, MAX));

  const [guessRed, setGuessRed]     = React.useState(getRandomIntegerBetween(MIN, MAX));
  const [guessGreen, setGuessGreen] = React.useState(getRandomIntegerBetween(MIN, MAX));
  const [guessBlue, setGuessBlue]   = React.useState(getRandomIntegerBetween(MIN, MAX));

  const [cheatingMode, setCheatingMode] = React.useState(false);
  const [showingFeedback, setShowingFeedback] = React.useState(false);

  const onChangeCheatingMode = React.useCallback((e) => {
    setCheatingMode(e.target.checked);
  }, []);

  const doGuess = React.useCallback(() => {
    setShowingFeedback(true);
  }, []);

  const doAdvance = React.useCallback(() => {
    // Reset the new color values for the box
    setRed(getRandomIntegerBetween(MIN,MAX));
    setGreen(getRandomIntegerBetween(MIN,MAX));
    setBlue(getRandomIntegerBetween(MIN,MAX));

    //Reset the new color values for the cheating box and sliders
    setGuessRed(getRandomIntegerBetween(MIN,MAX));
    setGuessGreen(getRandomIntegerBetween(MIN,MAX));
    setGuessBlue(getRandomIntegerBetween(MIN,MAX));

    // Hide the feedback
    setShowingFeedback(false);
  }, []);

  const onKeyDown = React.useCallback((e) => {
    if(e.key === "Enter") {
        doGuess();
    }
  }, [doGuess]);

  const showUserDimensions = cheatingMode || showingFeedback;

  return (
    <div className="App">
      <label id="cheating-mode">Cheating mode <input type="checkbox" value={cheatingMode} onChange={onChangeCheatingMode} /></label>

      <div id="color-preview" style={{backgroundColor: `rgb(${red}, ${green}, ${blue})`}} />
      {showUserDimensions && <div id="guess-preview" style={{backgroundColor: `rgb(${guessRed}, ${guessGreen}, ${guessBlue})`}} />}

      {!showingFeedback && <p>Guess the color of the rectangle</p>}
      {showingFeedback && <p>Your guess: rgb({guessRed},{guessGreen}, {guessBlue}). Actual: <strong>rgb({red}, {green}, {blue})</strong></p>}

      {!showingFeedback && <div id="color-picker">
        <div className="row">
          <span className="component-color-preview" style={{backgroundColor: `rgb(255, 0, 0, ${guessRed/MAX})`  }}>Red:</span>
          <Slider min={MIN} max={MAX} startingValue={guessRed} onChange={r => setGuessRed(r)} />
        </div>
        <div className="row">
          <span className="component-color-preview" style={{backgroundColor: `rgb(0, 255, 0, ${guessGreen/MAX})`}}>Green:</span>
          <Slider min={MIN} max={MAX} startingValue={guessGreen} onChange={g => setGuessGreen(g)} />
        </div>
        <div className="row">
          <span className="component-color-preview" style={{backgroundColor: `rgb(0, 0, 255, ${guessBlue/MAX})` }}>Blue:</span>
          <Slider min={MIN} max={MAX} startingValue={guessBlue} onChange={b => setGuessBlue(b)} />
        </div>
      </div>}

      {!showingFeedback && <button onClick={doGuess}>Guess</button> }
      {showingFeedback && <button onClick={doAdvance}>Next</button> }

    </div>
  );
}

export default App;

function getRandomIntegerBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}