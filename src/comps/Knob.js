

const Knob = (probs) => {
    const {
        param, on_change
    } = probs;

    const
        radius = 10,
        min_value = typeof param.min_value === "number" ? param.min_value : 0,
        max_value = typeof param.min_value === "number" ? param.max_value : 100,

        value_lim = Math.max(min_value, Math.min(max_value, param.true_value)),
        value_ratio = (value_lim - min_value) / (max_value - min_value),

        mvalue_lim = Math.max(min_value, Math.min(max_value, param.value)),
        mvalue_ratio = (mvalue_lim - min_value) / (max_value - min_value)
    ;

    function line(value, className) {
        const
            r = (-45 + 270 * value) / 180. * Math.PI,
            sx = -Math.cos(r) * radius,
            sy = -Math.sin(r) * radius;
        return <line x1={0} y1={0} x2={sx} y2={sy} className={className}/>;
    }

    function handle_move(e) {
        if (e.buttons === 1) {
            const new_value = param.true_value - e.movementY / (max_value - min_value) / 100;
            console.log(new_value);
            if (on_change)
                on_change(new_value);
        }
    }

    return (
        <div
            className={"knob"}
            onMouseMove={handle_move}
            title={`${param.help} (${param.value})`}
        >
            <svg
                width={"2rem"}
                height={"2rem"}
                viewBox={`${-radius} ${-radius} ${radius*2} ${radius*2}`}
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle cx={0} cy={0} r={10} className={"circle"}/>
                {line(mvalue_ratio, "mod-value")}
                {line(value_ratio, "value")}
            </svg>
            <div className={"name"}>{param.name}</div>
        </div>
    )
};


export default Knob;