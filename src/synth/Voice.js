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
            "frequency": {
                default: 500,
                min_value: -22050, max_value: 22050,
                help: "frequency in Hertz",
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

    apply_params = () => {
        const now = this.context.currentTime;
        if (this.param("frequency") !== this.osc.frequency.value)
            this.osc.frequency.setValueAtTime(this.param("frequency"), now);
        if (this.param("amp") !== this.gain.gain.value)
            this.gain.gain.setValueAtTime(this.param("amp"), now);
        if (this.param("type") !== this.osc.type)
            this.osc.type = this.param("type");
        if (this.param("filter_frequency") !== this.filter.frequency.value)
            this.filter.frequency.setValueAtTime(this.param("filter_frequency"), now);
        if (this.param("gate") >= .5) {
            this.env.gain.cancelScheduledValues(now);
            this.env.gain.linearRampToValueAtTime(1, now + this.param("attack") / 1000.);
            this.env.gain.linearRampToValueAtTime(0, now + (this.param("attack") + this.param("decay")) / 1000.);
        }
    };

    get_state = () => {
        return {
            params: this.get_params_state(),
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
