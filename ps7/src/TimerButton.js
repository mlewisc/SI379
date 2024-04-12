import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faSquare } from "@fortawesome/free-solid-svg-icons";

const sec_per_minute = 60;
let breakTimeEnded = false;

const playIcon = <FontAwesomeIcon icon={faPlay} />;
const stopIcon = <FontAwesomeIcon icon={faSquare} />;

export default function TimerButton(props) {
  const [timeLeft, setTimeLeft] = React.useState(props.workTime);
  const [breakTimeLeft, setBreakTimeLeft] = React.useState(props.breakTime);
  const [showTimer, setShowTimer] = React.useState(false);
  const [showBreakFeedback, setShowBreakFeedback] = React.useState(false);
  const [showStart, setShowStart] = React.useState(true);
  const intervalRef = React.useRef();

  function startTimer() {
    props.runningTaskIndex();
    props.setControlVisibility(false);
    props.updateH1Visibility(false);
    props.setDisabledState(true);
    setShowTimer(true);
    setShowStart(false);
    setTimeLeft(props.workTime * sec_per_minute);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTimeLeft((previousTimeLeft) => {
        if (previousTimeLeft <= 0) {
          clearInterval(intervalRef.current);
          setShowTimer(false);
          startBreakTimer();
          return 0;
        } else {
          return previousTimeLeft - 1;
        }
      });
    }, 1000);
  }

  function startBreakTimer() {
    setShowBreakFeedback(true);
    setBreakTimeLeft(props.breakTime * sec_per_minute);
    intervalRef.current = setInterval(() => {
      setBreakTimeLeft((previousBreakTimeLeft) => {
        if (previousBreakTimeLeft <= 0) {
          clearInterval(intervalRef.current);
          breakTimeEnded = true;
          return 0;
        } else {
          return previousBreakTimeLeft - 1;
        }
      });
    }, 1000);
  }

  // Format the time display in HH:MM:SS
  const timerDisplay = new Date(timeLeft * 1000).toISOString().slice(11, 19);

  const breakTimer = new Date(breakTimeLeft * 1000).toISOString().slice(11, 19);

  if (breakTimeEnded) {
    props.updateLemonsNum(props.numLemons + 1);
    setShowBreakFeedback(false);
    endTimer();
    breakTimeEnded = false;
  }

  function endTimer() {
    clearInterval(intervalRef.current);
    props.updateH1Visibility(true);
    setShowTimer(false);
    setShowStart(true);
    setBreakTimeLeft(props.breakTime);
    setTimeLeft(props.workTime);
    props.runningTaskIndex();
    props.setControlVisibility(true);
    props.setDisabledState(false);
  }

  function onStopClick() {
    clearInterval(intervalRef.current);
    setShowTimer(false);
    setShowStart(true);
    props.runningTaskIndex();
    props.setControlVisibility(true);
    props.updateH1Visibility(true);
    props.setDisabledState(false);
  }

  return (
    <React.Fragment>
      <div className="work-time-display">
        {showTimer && <div className="timer">{timerDisplay}</div>}{" "}
        {showStart && (
          <button className="start-btn" onClick={startTimer}>
            {playIcon} Start
          </button>
        )}
        {showTimer && (
          <button className="stop-btn" onClick={onStopClick}>
            {stopIcon} Stop
          </button>
        )}
      </div>
      {showBreakFeedback && (
        <div className="break-timer-overlay">Take a break {breakTimer} </div>
      )}
    </React.Fragment>
  );
}
