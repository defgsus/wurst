
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
        return p.value + p.modulation_value;
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
            values[key] = param.value + param.modulation_value;
        }
        return values;
    };

    set_modulatable_param = (name, value) => {
        if (!this.params[name])
            return false;
        this.params[name].value = value;
        return true;
    };

}

