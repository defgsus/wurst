import Modulatable from "./Modulatable";

export default class Sequence extends Modulatable {
    constructor(synth, params=null) {
        super({
            "speed_div": {
                default: 1,
                help: "divider of step speed"
            },
            "target": {
                default: "voice.0.gate",
                help: "target of the sequence modulation"
            },
            "values": {
                default: [0, 0, 0, 0, 0, 0, 0, 0],
                help: "values"
            }
        }, params);

        this.synth = synth;
        this.tick = 0;
        this.sub_tick = 0;
        this.index = 0;
        this.last_index = -1;
    }

    length = () => this.params.values.value.length;

    get_state = () => {
        return {
            tick: this.tick,
            index: this.index,
            //target: this.target,
            //values: this.values,
            params: this.get_params_state(),
            //...this.get_modulated_param_values()
        };
    };

    apply_tick = () => {
        this.sub_tick += 1;
        if (this.sub_tick >= this.param("speed_div")) {
            this.sub_tick = 0;
            this.tick += 1;
        }
        this.last_index = this.index;
        this.index = this.tick % this.length();
    };

    reset_tick = () => {
        this.tick = 0;
        this.sub_tick = 0;
        this.index = 0;
        this.last_index = -1;
    };

    get_value = () => this.params.values.value[this.index];

    set_value = (index, value) => {
        const new_sequence = [...this.param("values")];
        new_sequence[index] = value;
        this.set_param("values", new_sequence);
    };

    set_param = (name, value) => {
        if (!this.set_modulatable_param(name, value)) {
            throw `No valid sequence param: ${name}`;
        }
    };

}

