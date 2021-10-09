import React, {Component, useContext} from "react";
import state_context from "../context";
import Knob from "./Knob";
import VFader from "./VFader";
import Select from "./Select";


const Voice = (props) => {
    const { voices, dispatcher } = useContext(state_context);
    const { voice_id } = props;
    const voice = voices[voice_id];

    return (
        <div className={"voice"}>
            <div className={"header"}>voice.{voice_id}</div>
            <div className={"content"}>
                <div className={"grid-x margin-right"}>
                    <Knob
                        param={voice.params.amp}
                        on_change={value => dispatcher({type: "SET_VOICE_PARAM", id: voice_id, name: "amp", value})}
                    />
                    <Select
                        param={voice.params.type}
                        on_change={value => dispatcher({type: "SET_VOICE_PARAM", id: voice_id, name: "type", value})}
                    />
                </div>

                <div className={"grid-x margin-right"}>
                    <VFader
                        type={"number"}
                        param={voice.params.frequency}
                        on_change={value => dispatcher({type: "SET_VOICE_PARAM", id: voice_id, name: "frequency", value})}
                    />
                    <VFader
                        param={voice.params.amp}
                        on_change={value => dispatcher({type: "SET_VOICE_PARAM", id: voice_id, name: "amp", value})}
                    />
                    <VFader
                        param={voice.params.attack}
                        on_change={value => dispatcher({type: "SET_VOICE_PARAM", id: voice_id, name: "attack", value})}
                    />
                    <VFader
                        param={voice.params.decay}
                        exponent={1.9}
                        on_change={value => dispatcher({type: "SET_VOICE_PARAM", id: voice_id, name: "decay", value})}
                    />
                    <VFader
                        param={voice.params.filter_frequency}
                        exponent={1.9}
                        on_change={value => dispatcher({type: "SET_VOICE_PARAM", id: voice_id, name: "filter_frequency", value})}
                    />
                </div>
            </div>
        </div>
    );

};

export default Voice;
