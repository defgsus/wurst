import React, {Component, useContext} from "react";
import state_context from "../context";


const Voice = (props) => {
    const { voices, dispatcher } = useContext(state_context);
    const { voice_id } = props;
    const voice = voices[voice_id];

    return (
        <div className={"voice"}>
            <input
                type={"number"}
                value={voice.frequency}
                onChange={e => dispatcher({type: "SET_VOICE_PARAM", id: voice_id, name: "frequency", value: parseFloat(e.target.value)})}
            />
        </div>
    );

};

export default Voice;
