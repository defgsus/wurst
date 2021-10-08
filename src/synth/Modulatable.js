
export default class Modulatable {
    constructor(param_def) {
        this.params = {};
        for (const key of Object.keys(param_def)) {
            const param = param_def[key];
            this.params[key] = {
                ...param,
                value: param.default,
                modulated_value: param.default,
            };
        }
    }

    reset_modulation = () => {
        for (const key of Object.keys(this.params)) {
            const param = this.params[key];
            param.modulated_value = param.value;
        }
    };

    add_modulation_value = (name, value) => {
        this.params[name].modulated_value += value;
    };

    param = (name) => {
        return this.params[name].modulated_value;
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
            values[key] = param.modulated_value;
        }
        return values;
    };

}

