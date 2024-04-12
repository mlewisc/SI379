import React from "react";
import TimerButton from "./TimerButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faLemon } from "@fortawesome/free-solid-svg-icons";

const removeIcon = <FontAwesomeIcon icon={faTrashCan} />;
const lemonIcon = (
  <FontAwesomeIcon icon={faLemon} style={{ color: "#FFD43B" }} />
);

export default function TaskStrip(props) {
  const inputRef = React.useRef();
  const [task, setTask] = React.useState(props.value);
  const [focused, setFocused] = React.useState(false);
  const [classShow, setClassShow] = React.useState("");
  const [isDisabled, setIsDisabled] = React.useState(false);

  function updateValue() {
    const inputElement = inputRef.current;
    setTask(inputElement.value);
    props.updateTaskValueCallback(inputElement.value);
  }

  function onFocus() {
    const newIsFocused = true;
    const newClassShow = "show-remove";
    setFocused(newIsFocused);
    setClassShow(newClassShow);
  }

  function onBlur() {
    const newIsFocused = false;
    const newClassShow = "";
    setFocused(newIsFocused);
    setClassShow(newClassShow);
  }

  function handleRemove() {
    props.updateTasksCallback();
  }

  function updateDisabledState(bool) {
    setIsDisabled(bool);
  }

  function addLemons() {
    const lemonList = [];
    for (let i = 0; i < props.numLemons; i++) {
      lemonList.push(
        <div key={"lemon" + i} className="lemon-box">
          {lemonIcon}
        </div>
      );
    }
    return lemonList;
  }

  return (
    <React.Fragment>
      <div className="task-input">
        <input
          type="text"
          value={task}
          ref={inputRef}
          placeholder="Task description"
          onChange={updateValue}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={isDisabled}
        ></input>
        <button
          className={`remove-btn ${classShow}`}
          onClick={handleRemove}
          onMouseDown={handleRemove}
        >
          {removeIcon}
        </button>
      </div>
      <div className="lemons">
        {addLemons().map((lemon) => {
          return lemon;
        })}
      </div>
      <TimerButton
        workTime={props.workTime}
        breakTime={props.breakTime}
        runningTaskIndex={props.runningTaskIndex}
        setControlVisibility={props.setControlVisibility}
        updateH1Visibility={props.updateH1Visibility}
        setDisabledState={updateDisabledState}
        updateLemonsNum={props.updateNumLemonsCallback}
        numLemons={props.numLemons}
      />
    </React.Fragment>
  );
}
