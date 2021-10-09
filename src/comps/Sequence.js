import React, { useContext } from "react";
import TargetSelect from "./TargetSelect";
import state_context from "../context";
import Number from "./Number";


const Sequence = (props) => {

    const { sequence_id } = props;
    const { sequences, dispatcher } = useContext(state_context);
    const
        sequence = sequences[sequence_id],
        values = sequence.params.values.value,
        length = values.length;

    return (
        <div className={"sequence"}>
            <div className={"header"}>sequence.{sequence_id}</div>
            <div className={"content"}>
                <div className={"grid-x"}>
                    <TargetSelect
                        target={sequence.params.target.value}
                        on_change={value => {
                            dispatcher({type: "SET_SEQUENCE_PARAM", id: sequence_id, name: "target", value});
                        }}
                    />
                    <Number
                        param={sequence.params.amp}
                        on_change={value => dispatcher({type: "SET_SEQUENCE_PARAM", id: sequence_id, name: "amp", value})}
                    />
                </div>

                <div className={"values"} style={{grid: `auto-flow / repeat(${length}, ${1/length}fr)`}}>
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

                <div style={{height: ".75rem"}}/>

                <div className={"grid-x"}>
                    <Number
                        param={sequence.params.length}
                        on_change={value => dispatcher({type: "SET_SEQUENCE_PARAM", id: sequence_id, name: "length", value})}
                    />
                    <Number
                        param={sequence.params.speed_div}
                        on_change={value => dispatcher({type: "SET_SEQUENCE_PARAM", id: sequence_id, name: "speed_div", value})}
                    />
                </div>

            </div>
        </div>
    );
};

export default Sequence;

