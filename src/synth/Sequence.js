import Modulatable from "./Modulatable";

export default class Sequence extends Modulatable {
    constructor(synth) {
        super({
            "speed_div": {
                default: 1,
                help: "divider of step speed"
            }
        });

        this.synth = synth;
        this.values = [1, 0, 0, 0, 1, 0, 0, 0];
        this.tick = 0;
        this.sub_tick = 0;
        this.index = 0;
        this.last_index = -1;
        this.target = "voice.0.gate"
    }

    get_state = () => {
        return {
            tick: this.tick,
            index: this.index,
            target: this.target,
            values: this.values,
            ...this.get_modulated_param_values()
        };
    };

    apply_tick = () => {
        this.sub_tick += 1;
        if (this.sub_tick >= this.param("speed_div")) {
            this.sub_tick = 0;
            this.tick += 1;
        }
        this.last_index = this.index;
        this.index = this.tick % this.values.length;
    };

    reset_tick = () => {
        this.tick = 0;
        this.sub_tick = 0;
        this.index = 0;
        this.last_index = -1;
    };

    get_value = () => this.values[this.index];

    set_value = (index, value) => {
        const new_sequence = [...this.values];
        new_sequence[index] = value;
        this.values = new_sequence;
    };

}

