import React, {Component, useContext} from "react";
import state_context from "../context";
import Number from "./Number";


const Clock = (props) => {
    const { tick, params, dispatcher } = useContext(state_context);

    return (
        <div {...props}>
            <b>{Math.floor(tick / params.bar_length.value) + 1}.{tick % params.bar_length.value + 1}</b>

            <div className={"grid-x"}>
                <Number
                    param={params.bar_length}
                    on_change={value => dispatcher({type: "SET_MAIN_PARAM", name: "bar_length", value})}
                />
                <Number
                    param={params.note_div}
                    on_change={value => dispatcher({type: "SET_MAIN_PARAM", name: "note_div", value})}
                />
                <Number
                    param={params.bpm}
                    on_change={value => dispatcher({type: "SET_MAIN_PARAM", name: "bpm", value})}
                />
            </div>
        </div>
    );
};

export default Clock;
