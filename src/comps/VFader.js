import React, { useState } from "react";


function get_event_height_ratio(e) {
    const
        elem = e.target.classList.contains("value") || e.target.classList.contains("mod-value")
            ? e.target.parentElement
            : e.target,
        rect = elem.getBoundingClientRect(),
        value = (e.clientY - rect.y) / rect.height;
    return value;
}


const VFader = (probs) => {
    const { param, on_change, exponent } = probs;
    const [do_display, update_display] = useState(false);

    const
        height = probs.height || 8,
        min_value = typeof param.min_value === "number" ? param.min_value : 0,
        max_value = typeof param.min_value === "number" ? param.max_value : 100,

        value_lim = Math.max(min_value, Math.min(max_value, param.true_value)),
        value_ratio = Math.pow((value_lim - min_value) / (max_value - min_value), 1./(exponent || 1)),
        v_on = height * value_ratio,
        v_off = height * (1. - value_ratio),

        mvalue_lim = Math.max(min_value, Math.min(max_value, param.value)),
        mvalue_ratio = Math.pow((mvalue_lim - min_value) / (max_value - min_value), 1./(exponent || 1)),
        mv_on = height * mvalue_ratio,
        mv_off = height * (1. - mvalue_ratio);

    const change_event = on_change && (e => (
        on_change(
            (Math.pow(1. - get_event_height_ratio(e), exponent || 1) * (max_value - min_value) + min_value)
                .toFixed(2)
        )
    ));

    return (
        <div
            className={"vfader"}
            title={`${param.name} (${param.value})`}
            style={{height: `${height}rem`}}
            onMouseDown={e => { if (change_event) change_event(e); update_display(true); }}
            onMouseMove={e => { if (change_event && e.buttons === 1) { change_event(e); update_display(true); }}}
            onMouseUp={e => update_display(false)}
            onMouseLeave={e => update_display(false)}
        >
            <div className={"display" + (do_display ? "" : " hidden")}>{param.name}: <b>{value_lim}</b></div>
            <div className={"grid-x"}>
                <div
                    className={"value"}
                    style={{marginTop: `${v_off}rem`, height: `${v_on}rem`}}
                />
                <div
                    className={"mod-value"}
                    style={{marginTop: `${mv_off}rem`, height: `${mv_on}rem`}}
                />
            </div>
        </div>
    )
};


export default VFader;
