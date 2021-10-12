import React, { Component, useContext, useEffect, useState } from "react";
import state_context from "../context";
import Sequence from "./Sequence";
import Voice from "./Voice";

/* TODO: current setTimeout()-on-dispatcher procedure is a quite ugly one */

let _clock_timeout = null;
let _bpm, _bar_length, _note_div, _dispatcher, _interval, _playback_state;

function update_tick(playback_state, bpm, bar_length, note_div, dispatcher) {
    _playback_state = playback_state;
    _bpm = bpm;
    _bar_length = bar_length;
    _note_div = note_div;
    _dispatcher = dispatcher;
    _interval = 240 / _bpm / _note_div * 1000;
    if (_clock_timeout)
        return;
    if (_playback_state === "play")
        _clock_timeout = setTimeout(tick_loop, _interval);
}

function tick_loop() {
    _dispatcher({type: "TICK"});
    if (_playback_state === "play")
        _clock_timeout = setTimeout(tick_loop, _interval);
    else
        _clock_timeout = null;
}


const Synth = (props) => {

    const state = useContext(state_context);
    const {
        tick, playback_state, params,
        voices, sequences, dispatcher
    } = state;

    //console.log("STATE", state);
    update_tick(playback_state, params.bpm.value, params.bar_length.value, params.note_div.value, dispatcher);

    const voice_panes = {};
    for (const key of Object.keys(voices))
        voice_panes[key] = [];
    voice_panes["extra"] = [];

    for (const key of Object.keys(sequences)) {
        const target = sequences[key].params.target.value.split(".");
        if (target[0] === "voice")
            voice_panes[target[1]].push(key);
        else
            voice_panes["extra"].push(key)
    }

    return (
        <div className={"synth"}>

            {Object.keys(voice_panes).map(voice_id => (
                <div className={"voice-pane"} key={voice_id}>
                    {voice_id !== "extra"
                        ? <Voice voice_id={voice_id}/>
                        : null
                    }
                    {voice_panes[voice_id].map(seq_key => (
                        <Sequence
                            key={seq_key}
                            sequence_id={seq_key}
                        />
                    ))}
                    {voice_id === "extra"
                        ? (
                            <div>
                                <button
                                    className={"add-button"}
                                    onClick={e => dispatcher({type: "ADD_SEQUENCE"})}>
                                    seq +
                                </button>
                                <button
                                    className={"add-button"}
                                    onClick={e => dispatcher({type: "ADD_VOICE"})}>
                                    voice +
                                </button>
                            </div>
                        )
                        : null
                    }
                </div>
            ))}

            {/*<pre>{JSON.stringify(state, null, 2)}</pre>*/}
        </div>
    );

};

export default Synth;