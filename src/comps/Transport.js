import React, { Component, useContext } from "react";
import state_context from "../context";
import Clock from "./Clock";


const Transport = (props) => {
    const { dispatcher } = useContext(state_context);

    return (
        <div className={"transport"} {...props}>
            <div>
                <Clock/>
            </div>

            <div>
                <button onClick={e => dispatcher({type: "TRANSPORT_SIGNAL", signal: "stop"})}>STOP</button>
                <button onClick={e => dispatcher({type: "TRANSPORT_SIGNAL", signal: "play"})}>PLAY</button>
            </div>
        </div>
    );
};

export default Transport;
