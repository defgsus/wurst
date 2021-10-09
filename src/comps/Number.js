

const Number = (probs) => {
    const {
        param, on_change
    } = probs;

    return (
        <div className={"number"}>
            <input
                type={"number"}
                min={param.min_value}
                max={param.max_value}
                step={param.step || 1}
                value={param.true_value}
                onChange={e => {
                    let value = parseFloat(e.target.value);
                    if (on_change && !isNaN(value)) {
                        if (typeof param.min_value === "number")
                            value = Math.max(param.min_value, value);
                        if (typeof param.max_value === "number")
                            value = Math.min(param.max_value, value);
                        on_change(value);
                    }
                }}
            />
            <div className={"name"}>{param.name}</div>
        </div>
    )
};


export default Number;