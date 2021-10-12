import { useReducer } from "react";
import state_context from "./context";
import SynthEngine from "./synth/SynthEngine";
import { DEMO01 } from "./songs";

let _synth = new SynthEngine();

function _init_synth() {
    //const data = restore("wurst");
    const data = DEMO01;
    if (data)
        _synth.deserialize(data);
}
_init_synth();


export function reducer(state, action) {
    switch (action.type) {

        case "TICK":
            //console.log("TICK", action, state);
            _synth.apply_tick();
            return _synth.get_state();

        case "TRANSPORT_SIGNAL":
            _synth.apply_transport_signal(action.signal);
            return _synth.get_state();

        case "ADD_VOICE":
            _synth.add_voice();
            return _synth.get_state();

        case "ADD_SEQUENCE":
            _synth.add_sequence();
            return _synth.get_state();

        case "NEW":
            _synth.stop();
            _synth = new SynthEngine();
            return _synth.get_state();

        case "SAVE":
            store(action.name, _synth.serialize());
            return state;

        case "LOAD": {
            const data = restore(action.name);
            _synth.deserialize(data);
            return _synth.get_state();
        }
        case "SET_MAIN_PARAM":
            _synth.set_main_param(action.name, action.value);
            return _synth.get_state();

        case "SET_VOICE_PARAM":
            _synth.set_voice_param(action.id, action.name, action.value);
            return _synth.get_state();

        case "SET_SEQUENCE_VALUE":
            _synth.set_sequence_value(action.id, action.index, action.value);
            return _synth.get_state();

        case "SET_SEQUENCE_PARAM":
            _synth.set_sequence_param(action.id, action.name, action.value);
            return _synth.get_state();

        default:
            return state;
    }
}


export const StateProvider = ({children}) => {
    const [state, dispatcher] = useReducer(reducer, _synth.get_state());
    //dispatcher({type: "TICK"});
    return (
        <state_context.Provider value={{...state, dispatcher}}>
            {children}
        </state_context.Provider>
    );
};


function store(name, data) {
    const data_str = JSON.stringify(data);
    console.log("THE SONG:");
    console.log(data_str);
    sessionStorage.setItem(name, data_str);
}

function restore(name) {
    const str = sessionStorage.getItem(name);
    if (!str)
        return;
    return JSON.parse(str);
}
