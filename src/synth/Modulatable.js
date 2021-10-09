
export default class Modulatable {

    constructor(param_def, init=null) {
        this.params = {};
        for (const key of Object.keys(param_def)) {
            const param = param_def[key];
            let value = param.default;
            if (init && typeof init[key] !== "undefined")
                value = init[key];

            this.params[key] = {
                ...param,
                value: value,
                modulation_value: 0,
            };
        }
    }

    reset_modulation = () => {
        for (const key of Object.keys(this.params)) {
            const param = this.params[key];
            param.modulation_value = 0;
        }
    };

    add_modulation_value = (name, value) => {
        this.params[name].modulation_value += value;
    };

    param = (name) => {
        const p = this.params[name];
        return _modulated_value(p);
    };

    get_param_values = () => {
        const values = {};
        for (const key of Object.keys(this.params)) {
            const param = this.params[key];
            values[key] = param.value;
        }
        return values;
    };

    get_modulated_param_values = () => {
        const values = {};
        for (const key of Object.keys(this.params)) {
            const param = this.params[key];
            values[key] = _modulated_value(param);
        }
        return values;
    };

    get_params_state = () => {
        const values = {};
        for (const key of Object.keys(this.params)) {
            const param = this.params[key];
            values[key] = {
                name: key,
                value: _modulated_value(param),
                true_value: param.value,
                min_value: param.min_value,
                max_value: param.max_value,
                help: param.help,
            };
        }
        return values;
    };

    set_modulatable_param = (name, value) => {
        if (!this.params[name])
            return false;
        if (typeof this.params[name].value === "number")
            value = parseFloat(value);
        this.params[name].value = value;
        return true;
    };

}


function _modulated_value(p) {
    let value = p.value;
    if (typeof p.value === "number" && typeof p.modulation_value === "number")
        value = value + p.modulation_value;
    if (typeof p.min_value === "number")
        value = Math.max(p.min_value, value);
    if (typeof p.max_value === "number")
        value = Math.min(p.max_value, value);
    return value;
}