import React from "react";
import TaskStrip from "./TaskStrip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const plusIcon = <FontAwesomeIcon icon={faPlus} />;

const KEY = "tasks";
const startingTaskItems = JSON.parse(localStorage.getItem(KEY) || "[]");
let keyId = startingTaskItems.length
  ? startingTaskItems[startingTaskItems.length - 1].key + 1
  : 0;

export default function Tasks(props) {
  const [taskList, setTaskList] = React.useState(startingTaskItems);
  const [runningTaskIndex, setRunningTaskIndex] = React.useState();
  const [h1Visible, setH1Visible] = React.useState(true);

  function onAdd() {
    const newTaskList = taskList.concat({
      key: keyId,
      value: "",
      numLemons: 0,
    });
    setTaskList(newTaskList);
    localStorageState(newTaskList);
    keyId++;
  }

  function setTaskValue(value, index) {
    const newTaskList = taskList;
    newTaskList[index].value = value;
    setTaskList(newTaskList);
    localStorageState(newTaskList);
  }

  function setNumLemonValue(value, index) {
    const newTaskList = taskList;
    newTaskList[index].numLemons = value;
    setTaskList(newTaskList);
    localStorageState(newTaskList);
  }

  function localStorageState(newTaskList) {
    localStorage.setItem(KEY, JSON.stringify(newTaskList));
  }

  function updateTasks(index) {
    const newTasks = taskList.filter((task, taskIdx) => taskIdx !== index);
    console.log(newTasks);
    setTaskList(newTasks);
    localStorageState(newTasks);
  }

  function updateRunningTaskIndex(index) {
    if (runningTaskIndex === undefined) {
      setRunningTaskIndex(index);
    } else {
      setRunningTaskIndex(undefined);
    }
  }

  function updateHeadingVisibilityCallback(visible) {
    setH1Visible(visible);
  }

  return (
    <React.Fragment>
      <div className="task-container">
        {h1Visible && <h1>What do you want to do?</h1>}
        {taskList.map((taskData, index) => {
          if (runningTaskIndex === undefined || runningTaskIndex === index) {
            return (
              <div key={taskData.key} className="task-row">
                <TaskStrip
                  value={taskData.value}
                  numLemons={taskData.numLemons}
                  updateTaskValueCallback={(value) =>
                    setTaskValue(value, index)
                  }
                  updateNumLemonsCallback={(value) =>
                    setNumLemonValue(value, index)
                  }
                  updateTasksCallback={() => updateTasks(index)}
                  workTime={props.workTime}
                  breakTime={props.breakTime}
                  runningTaskIndex={() => updateRunningTaskIndex(index)}
                  setControlVisibility={props.setControlVisibility}
                  updateH1Visibility={updateHeadingVisibilityCallback}
                />
              </div>
            );
          }
        })}
        {runningTaskIndex === undefined && (
          <button className="add-task" onClick={onAdd}>
            {plusIcon} add task
          </button>
        )}
      </div>
    </React.Fragment>
  );
}
