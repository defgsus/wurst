import React, { Component, useContext, useEffect } from "react";
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

    return (
        <div className={"synth"}>

            {Object.keys(voices).map(key => (
                <Voice
                    key={key}
                    voice_id={key}
                />
            ))}

            {Object.keys(sequences).map(key => (
                <Sequence
                    key={key}
                    sequence_id={key}
                />
            ))}

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

            <pre>{JSON.stringify(state, null, 2)}</pre>
        </div>
    );

};

export default Synth;