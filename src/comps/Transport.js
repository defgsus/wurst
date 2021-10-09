import React, { Component, useContext } from "react";
import state_context from "../context";
import Clock from "./Clock";


const Transport = (props) => {
    const { beat, dispatcher } = useContext(state_context);

    return (
        <div className={"transport"} {...props}>
            <div className={"grid-x margin-right"}>
                <div style={{marginRight: "1rem"}}>
                    <b style={{fontSize: "1.5rem"}}>wurst {beat[0]}.{beat[1]}</b>
                </div>

                <div className={"grid-x margin-right right"}>
                    <div>
                        <Clock/>
                    </div>

                    <div>
                        <button onClick={e => dispatcher({type: "TRANSPORT_SIGNAL", signal: "stop"})}>STOP</button>
                    </div>
                    <div>
                        <button onClick={e => dispatcher({type: "TRANSPORT_SIGNAL", signal: "play"})}>PLAY</button>
                    </div>
                </div>
            </div>
            <hr/>
        </div>
    );
};

export default Transport;
