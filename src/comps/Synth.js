import React, { Component, useContext, useEffect } from "react";
import Sequence from "./Sequence";
import state_context from "../context";

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
    const { tick, playback_state, bpm, bar_length, note_div, sequences, dispatcher } = state;
    //console.log("STATE", state);
    update_tick(playback_state, bpm, bar_length, note_div, dispatcher);

    return (
        <div>
            {Object.keys(sequences).map(key => (
                <Sequence
                    key={key}
                    sequence_id={key}
                />
            ))}

            <pre>{JSON.stringify(state, null, 2)}</pre>
        </div>
    );

};

export default Synth;