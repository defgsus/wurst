import Modulatable from "./Modulatable";


export default class Voice extends Modulatable {
    constructor(synth, params=null) {
        super({
            "gate": {
                default: 0,
                min_value: 0, max_value: 1,
                help: "gate for amplitude envelope",
            },
            "type": {
                default: "sine",
                choices: ["sine", "square", "sawtooth", "triangle"]
            },
            "note": {
                default: 50,
                min_value: 1, max_value: 128,
                help: "musical note @ A4 == 440Hz",
            },
            "frequency": {
                default: 0,
                min_value: -22050, max_value: 22050,
                help: "frequency in Hertz",
            },
            "frequency_gate": {
                default: 0,
                min_value: 0, max_value: 1,
                help: "gate for frequency envelope",
            },
            "frequency_envelope": {
                default: 1000,
                min_value: -22000, max_value: 22000,
                help: "gate for frequency envelope",
            },
            "frequency_attack": {
                default: 10,
                min_value: 0, max_value: 5000,
                help: "attack of frequency envelope (milliseconds)",
            },
            "frequency_decay": {
                default: 200,
                min_value: 0, max_value: 5000,
                help: "decay of frequency envelope (milliseconds)",
            },

            "amp": {
                default: .5,
                min_value: 0, max_value: 1,
                help: "final amplitude",
            },
            "attack": {
                default: 10,
                min_value: 0, max_value: 5000,
                help: "attack of amplitude envelope (milliseconds)",
            },
            "decay": {
                default: 500,
                min_value: 0, max_value: 5000,
                help: "decay of amplitude envelope (milliseconds)",
            },

            "filter_frequency": {
                default: 22000,
                min_value: 1, max_value: 22050,
                help: "frequency in Hertz",
            },
            "filter_gate": {
                default: 0,
                min_value: 0, max_value: 1,
                help: "gate for filter envelope",
            },
            "filter_envelope": {
                default: 1000,
                min_value: -22000, max_value: 22000,
                help: "gate for filter envelope",
            },
            "filter_attack": {
                default: 10,
                min_value: 0, max_value: 5000,
                help: "attack of filter envelope (milliseconds)",
            },
            "filter_decay": {
                default: 200,
                min_value: 0, max_value: 5000,
                help: "decay of filter envelope (milliseconds)",
            },

        }, params);
        this.synth = synth;
        this.context = this.synth.context;

        this.osc = this.context.createOscillator();
        this.env = this.context.createGain();
        this.env.gain.setValueAtTime(0, 0);
        this.gain = this.context.createGain();
        this.filter = this.context.createBiquadFilter();
        this.osc
            .connect(this.env)
            .connect(this.gain)
            .connect(this.filter)
            .connect(this.context.destination);
        this.osc.start()
    }

    stop = () => {
        this.osc.stop();
    };

    base_freq = () => {
        const
            note = this.param("note"),
            freq = this.param("frequency");
        return 440.0 * Math.pow(Math.pow(2., 1./12), note - 57) + freq;
    };

    apply_params = () => {
        const
            now = this.context.currentTime,
            base_freq = this.base_freq()
        ;

        if (base_freq !== this.osc.frequency.value)
            this.osc.frequency.value = base_freq;
        if (this.param("amp") !== this.gain.gain.value)
            this.gain.gain.setValueAtTime(this.param("amp"), now);
        if (this.param("type") !== this.osc.type)
            this.osc.type = this.param("type");
        if (this.param("filter_frequency") !== this.filter.frequency.value)
            this.filter.frequency.value = this.param("filter_frequency");
        if (this.param("gate") >= .5) {
            this.env.gain.cancelScheduledValues(now);
            this.env.gain.linearRampToValueAtTime(1, now + this.param("attack") / 1000.);
            this.env.gain.linearRampToValueAtTime(0, now + (this.param("attack") + this.param("decay")) / 1000.);
        }
        if (this.param("frequency_gate") >= .5) {
            this.osc.frequency.cancelScheduledValues(now);
            this.osc.frequency.linearRampToValueAtTime(
                base_freq + this.param("frequency_envelope"),
                now + this.param("frequency_attack") / 1000.);
            this.osc.frequency.linearRampToValueAtTime(
                base_freq,
                now + (this.param("frequency_attack") + this.param("frequency_decay")) / 1000.);
        }
        if (this.param("filter_gate") >= .5) {
            this.filter.frequency.cancelScheduledValues(now);
            this.filter.frequency.linearRampToValueAtTime(
                this.param("filter_frequency") + this.param("filter_envelope"),
                now + this.param("filter_attack") / 1000.);
            this.filter.frequency.linearRampToValueAtTime(
                this.param("filter_frequency"),
                now + (this.param("filter_attack") + this.param("filter_decay")) / 1000.);
        }
    };

    get_state = () => {
        return {
            params: this.get_params_state(),
        };
    };

    serialize = () => {
        return {
            params: this.get_param_values(),
        };
    };

    set_param = (name, value) => {
        if (!this.set_modulatable_param(name, value)) {
            switch (name) {
                default:
                    throw `No valid voice param: ${name}`;
            }
        }
        this.apply_params();
    };

}
