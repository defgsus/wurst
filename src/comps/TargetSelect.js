import React, { Component, useContext } from "react";
import state_context from "../context";
import Clock from "./Clock";


const TargetSelect = (props) => {
    const { modulation_targets, dispatcher } = useContext(state_context);
    const { on_change, target } = props;

    return (
        <select
            className={"targets"} value={target}
            onChange={e => {
                if (on_change)
                    on_change(e.target.value);
            }}
        >
            {modulation_targets.map(t => (
                <option value={t} key={t}>{t}</option>
            ))}
        </select>
    );
};

export default TargetSelect;
