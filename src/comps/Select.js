import React, { Component, useContext } from "react";
import state_context from "../context";
import Clock from "./Clock";


const Select = (props) => {
    const { param, on_change } = props;

    return (
        <select
            className={"select"} value={param.value}
            onChange={e => {
                if (on_change)
                    on_change(e.target.value);
            }}
        >
            {param.choices.map(o => (
                <option value={o} key={o}>{o}</option>
            ))}
        </select>
    );
};

export default Select;
