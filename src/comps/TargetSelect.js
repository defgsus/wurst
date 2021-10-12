import React, { Component, useContext } from "react";
import state_context from "../context";
import Clock from "./Clock";


const TargetSelect = (props) => {
    const { modulation_targets } = useContext(state_context);
    const { on_change, target, sequence_id } = props;

    return (
        <div className={"select"} title={"select the modulation target"}>
            <select
                className={"targets"} value={target}
                onChange={e => {
                    if (on_change)
                        on_change(e.target.value);
                }}
            >
                {modulation_targets
                    .filter(t => !sequence_id || !t.startsWith("sequence.") || t.split(".")[1] !== sequence_id)
                    .map(t => (
                        <option value={t} key={t}>{t}</option>
                    ))
                }
            </select>
            <div style={{textAlign: "center"}}>target</div>
        </div>
    );
};

export default TargetSelect;
