import React from "react";

export default function Slider(props) {
    const { min, max, onChange, startingValue } = props;

    const [value, setValue] = React.useState(startingValue);

    const handleChange = React.useCallback(event => {
        const value = parseInt(event.target.value);
        setValue(value);
        onChange(value);
    }, [onChange]);


    return <>
            <input type="number" min={min} max={max} value={value} onChange={handleChange} />
            <input type="range"  min={min} max={max} value={value} onChange={handleChange} />
        </>;
}