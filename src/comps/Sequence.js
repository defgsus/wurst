import React, { useContext } from "react";
import TargetSelect from "./TargetSelect";
import state_context from "../context";


const Sequence = (props) => {

    const { sequence_id } = props;
    const { sequences, dispatcher } = useContext(state_context);
    const sequence = sequences[sequence_id];
    const values = sequence.params.values.value;

    return (
        <div className={"sequence"}>
            <TargetSelect
                target={sequence.params.target.value}
                on_change={value => {
                    dispatcher({type: "SET_SEQUENCE_PARAM", id: sequence_id, name: "target", value});
                }}
            />
            <div className={"values"}>
                {values.map((value, index) => (
                    <div
                        key={index}
                        className={"button" + (value ? " on" : " off") + (sequence.index === index ? " tick" : "")}
                        onClick={e => {
                            dispatcher({
                                type: "SET_SEQUENCE_VALUE",
                                id: sequence_id, index: index, value: 1 - values[index]
                            })
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default Sequence;

