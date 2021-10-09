

const Number = (probs) => {
    const {
        param, on_change
    } = probs;

    const
        min_value = typeof param.min_value === "number" ? param.min_value : 0,
        max_value = typeof param.min_value === "number" ? param.max_value : 100
        ;

    return (
        <div className={"number"}>
            <input
                type={"number"}
                min={min_value}
                max={max_value}
                step={param.step || 1}
                value={param.true_value}
                onChange={e => {
                    if (on_change && !isNaN(e.target.value))
                        on_change(e.target.value);
                }}
            />
            <div className={"name"}>{param.name}</div>
        </div>
    )
};


export default Number;