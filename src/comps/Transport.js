import React, { Component, useContext, useState } from "react";
import state_context from "../context";
import Clock from "./Clock";


const Transport = (props) => {
    const { beat, dispatcher } = useContext(state_context);

    const [ song_name, set_song_name ] = useState("wurst");

    return (
        <div className={"transport"} {...props}>
            <div className={"grid-x margin-right"}>
                <div style={{marginRight: "1rem"}} className={"grow"}>
                    <b style={{fontSize: "1.5rem"}}>wurst {beat[0]}.{beat[1]}</b>
                </div>

                <div className={"grid-x margin-right"}>
                    <div>
                        <Clock/>
                    </div>

                    <div>
                        <button onClick={e => dispatcher({type: "TRANSPORT_SIGNAL", signal: "stop"})}>STOP</button>
                    </div>
                    <div>
                        <button onClick={e => dispatcher({type: "TRANSPORT_SIGNAL", signal: "play"})}>PLAY</button>
                    </div>
                    <div>|</div>
                    <div>
                        <button onClick={e => dispatcher({type: "NEW"})}>NEW</button>
                    </div>
                    <div>|</div>
                    <div>
                        <button onClick={e => dispatcher({type: "LOAD", name: song_name})}>LOAD</button>
                    </div>
                    <div>
                        <button onClick={e => dispatcher({type: "SAVE", name: song_name})}>SAVE</button>
                    </div>
                    <div>
                        <input value={song_name} onChange={e => set_song_name(e.target.value)}/>
                    </div>
                </div>
            </div>
            <hr/>
        </div>
    );
};

export default Transport;
