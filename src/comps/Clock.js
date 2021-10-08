import React, {Component, useContext} from "react";
import state_context from "../context";


const Clock = (props) => {
    const { tick, bpm, bar_length, note_div } = useContext(state_context);

    return (
        <div {...props}>
            <span>{Math.floor(tick / bar_length) + 1}.{tick % bar_length + 1}</span>
            &nbsp;<span>{bar_length}/{note_div} @ {bpm}bpm</span>
        </div>
    );
};

export default Clock;
