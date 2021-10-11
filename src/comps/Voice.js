import React, {Component, useContext} from "react";
import state_context from "../context";
import Knob from "./Knob";
import VFader from "./VFader";
import Select from "./Select";
import Group from "./Group";


const Voice = (props) => {
    const { voices, dispatcher } = useContext(state_context);
    const { voice_id } = props;
    const voice = voices[voice_id];

    return (
        <div className={"voice"}>
            <div className={"header"}>voice.{voice_id}</div>
            <div className={"content"}>
                <div className={"grid-x margin-right"}>
                    {/*<Knob
                        param={voice.params.amp}
                        on_change={value => dispatcher({type: "SET_VOICE_PARAM", id: voice_id, name: "amp", value})}
                    />*/}
                    <Select
                        param={voice.params.type}
                        on_change={value => dispatcher({type: "SET_VOICE_PARAM", id: voice_id, name: "type", value})}
                    />
                </div>

                <div className={"grid-x margin-right"}>
                    <Group name={"freq"} className={"grid-x margin-right"}>
                        <VFader
                            type={"number"}
                            param={voice.params.note}
                            on_change={value => dispatcher({type: "SET_VOICE_PARAM", id: voice_id, name: "note", value})}
                        />
                        <VFader
                            type={"number"}
                            param={voice.params.frequency}
                            on_change={value => dispatcher({type: "SET_VOICE_PARAM", id: voice_id, name: "frequency", value})}
                        />
                        <VFader
                            type={"number"}
                            param={voice.params.frequency_envelope}
                            on_change={value => dispatcher({type: "SET_VOICE_PARAM", id: voice_id, name: "frequency_envelope", value})}
                        />
                        <VFader
                            type={"number"}
                            param={voice.params.frequency_attack}
                            on_change={value => dispatcher({type: "SET_VOICE_PARAM", id: voice_id, name: "frequency_attack", value})}
                        />
                        <VFader
                            type={"number"}
                            param={voice.params.frequency_decay}
                            on_change={value => dispatcher({type: "SET_VOICE_PARAM", id: voice_id, name: "frequency_decay", value})}
                        />
                    </Group>
                    <Group name={"amp"} className={"grid-x margin-right"}>
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
                    </Group>
                    <Group name={"filter"} className={"grid-x margin-right"}>
                        <VFader
                            param={voice.params.filter_frequency}
                            exponent={1.9}
                            on_change={value => dispatcher({type: "SET_VOICE_PARAM", id: voice_id, name: "filter_frequency", value})}
                        />
                        <VFader
                            type={"number"}
                            param={voice.params.filter_envelope}
                            on_change={value => dispatcher({type: "SET_VOICE_PARAM", id: voice_id, name: "filter_envelope", value})}
                        />
                        <VFader
                            type={"number"}
                            param={voice.params.filter_attack}
                            on_change={value => dispatcher({type: "SET_VOICE_PARAM", id: voice_id, name: "filter_attack", value})}
                        />
                        <VFader
                            type={"number"}
                            param={voice.params.filter_decay}
                            on_change={value => dispatcher({type: "SET_VOICE_PARAM", id: voice_id, name: "filter_decay", value})}
                        />
                    </Group>
                </div>
            </div>
        </div>
    );

};

export default Voice;
