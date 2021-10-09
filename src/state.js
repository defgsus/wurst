import { useReducer } from "react";
import state_context from "./context";
import SynthEngine from "./synth/SynthEngine";

let _synth = new SynthEngine();


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