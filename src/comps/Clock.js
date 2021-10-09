import React, {Component, useContext} from "react";
import state_context from "../context";
import Number from "./Number";


const Clock = (props) => {
    const { tick, beat, params, dispatcher } = useContext(state_context);

    return (
        <div {...props}>
            <div className={"grid-x margin-right"}>
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
