import React from "react";

export default function IntervalControl(props) {
  const [workTime, setWorkTime] = React.useState(props.workTime);
  const [breakTime, setBreakTime] = React.useState(props.breakTime);

  const workTimeRef = React.useRef();
  const breakTimeRef = React.useRef();

  function handleWorkTimeChange() {
    const newWorkTime = workTimeRef.current.value;
    setWorkTime(newWorkTime);
    props.updateWorkTimeCallback(newWorkTime);
  }

  function handleBreakTimeChange() {
    const newBreakTime = breakTimeRef.current.value;
    setBreakTime(newBreakTime);
    props.updateBreakTimeCallback(newBreakTime);
  }

  return (
    <React.Fragment>
      <div className="interval-control-container">
        <div className="interval-control">
          <label htmlFor="work-time">Work interval (minutes):</label>
          <input
            type="number"
            id="work-time"
            ref={workTimeRef}
            min={1}
            max={120}
            onChange={handleWorkTimeChange}
            value={workTime}
          ></input>
        </div>
        <div className="interval-control">
          <label htmlFor="break-time">Break time (minutes):</label>
          <input
            type="number"
            id="break-time"
            ref={breakTimeRef}
            min={1}
            max={120}
            onChange={handleBreakTimeChange}
            value={breakTime}
          ></input>
        </div>
      </div>
    </React.Fragment>
  );
}
