import Modulatable from "./Modulatable";

export default class Sequence extends Modulatable {
    constructor(synth, params=null) {
        super({
            "length": {
                default: 8,
                min_value: 1, max_value: 256,
                help: "length of sequence"
            },
            "speed_div": {
                default: 1,
                min_value: 1, max_value: 256,
                help: "divider of step speed"
            },
            "target": {
                default: "voice.0.gate",
                help: "target of the sequence modulation"
            },
            "values": {
                default: [0, 0, 0, 0, 0, 0, 0, 0],
                help: "sequence values"
            },
            "amp": {
                default: 1,
                help: "amplitude of output"
            }
        }, params);

        this.synth = synth;
        this.tick = 0;
        this.sub_tick = 0;
        this.index = 0;
        this.last_index = -1;
        this.params.length.value = this.params.values.value.length;
    }

    length = () => this.params.values.value.length;

    get_state = () => {
        return {
            tick: this.tick,
            index: this.index,
            params: this.get_params_state(),
        };
    };

    serialize = () => {
        return {
            tick: this.tick,
            index: this.index,
            params: this.get_param_values(),
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

    get_value = () => this.params.values.value[this.index] * this.param("amp");

    set_value = (index, value) => {
        const new_sequence = [...this.param("values")];
        new_sequence[index] = value;
        this.set_param("values", new_sequence);
    };

    set_param = (name, value) => {
        if (!this.set_modulatable_param(name, value)) {
            throw `No valid sequence param: ${name}`;
        }

        if (name === "length" && this.params.values.value.length !== value) {
            const new_seq = [];
            for (let i=0; i<value; ++i) {
                new_seq.push(
                    i < this.params.values.value.length
                        ? this.params.values.value[i]
                        : 0
                );
            }
            this.params.values.value = new_seq;
        }
        else if (name === "values" && this.params.length.value !== value.length) {
            this.params.length.value = value.length;
        }
    };

}

