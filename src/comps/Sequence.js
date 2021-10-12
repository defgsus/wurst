import React, { useContext } from "react";
import TargetSelect from "./TargetSelect";
import state_context from "../context";
import Number from "./Number";


const Sequence = (props) => {

    const { sequence_id } = props;
    const { params, sequences, dispatcher } = useContext(state_context);
    const
        sequence = sequences[sequence_id],
        values = sequence.params.values.value,
        length = values.length,
        bar_length = params.bar_length.value,
        num_bars = Math.floor(length / bar_length) + 1;

    const values_div = [];
    let sub_values_div = [];
    for (let i=0; i<values.length; ++i) {
        sub_values_div.push((
            <div
                key={i}
                className={"button" + (values[i] ? " on" : " off") + (sequence.index === i ? " tick" : "")}
                onClick={e => {
                    dispatcher({
                        type: "SET_SEQUENCE_VALUE",
                        id: sequence_id, index: i, value: 1 - values[i]
                    })
                }}
            />
        ));
        if (sub_values_div.length >= bar_length || i+1 === values.length) {
            values_div.push(
                <div
                    key={i}
                    className={"sub-values" + (values_div.length % 2 ? " odd" : "")}
                    style={{grid: `auto-flow / repeat(${bar_length}, ${1/bar_length}fr)`}}
                >
                    {sub_values_div}
                </div>
            );
            sub_values_div = [];
        }
    }

    return (
        <div className={"sequence"}>
            <div className={"header"}>sequence.{sequence_id}</div>
            <div className={"content"}>
                <div className={"grid-x"}>
                    <TargetSelect
                        target={sequence.params.target.value}
                        sequence_id={sequence_id}
                        on_change={value => {
                            dispatcher({type: "SET_SEQUENCE_PARAM", id: sequence_id, name: "target", value});
                        }}
                    />
                    <Number
                        param={sequence.params.amp}
                        on_change={value => dispatcher({type: "SET_SEQUENCE_PARAM", id: sequence_id, name: "amp", value})}
                    />
                </div>

                <div className={"values"} style={{grid: `auto-flow / repeat(${num_bars}, ${1/num_bars}fr)`}}>
                    {values_div}
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

