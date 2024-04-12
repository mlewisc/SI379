import React from "react";
import Tasks from "./Tasks";
import IntervalControl from "./IntervalControl";
import "./css/style.css";

function App() {
  const [workTime, setWorkTime] = React.useState(25);
  const [breakTime, setBreakTime] = React.useState(5);
  const [controlIsVisible, setControlIsVisible] = React.useState(true);

  function updateWorkTime(workTime) {
    setWorkTime(workTime);
  }

  function updateBreakTime(breakTime) {
    setBreakTime(breakTime);
  }

  function updateControlVisibility(bool) {
    setControlIsVisible(bool);
  }

  return (
    <React.Fragment>
      <Tasks
        workTime={workTime}
        breakTime={breakTime}
        setControlVisibility={updateControlVisibility}
      />
      {controlIsVisible && (
        <IntervalControl
          updateWorkTimeCallback={updateWorkTime}
          updateBreakTimeCallback={updateBreakTime}
          workTime={workTime}
          breakTime={breakTime}
        />
      )}
    </React.Fragment>
  );
}

export default App;
