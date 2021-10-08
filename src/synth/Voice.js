import Modulatable from "./Modulatable";


export default class Voice extends Modulatable {
    constructor(synth) {
        super({
            "frequency": {
                default: 500,
                help: "frequency in Hertz",
            },
            "gate": {
                default: 0,
                help: "gate for amplitude envelope",
            },
            "amp": {
                default: .5,
                help: "final amplitude",
            },
            "attack": {
                default: .1,
                help: "attack of amplitude envelope",
            },
            "decay": {
                default: 1.,
                help: "decay of amplitude envelope",
            },
        });
        this.synth = synth;
        this.context = this.synth.context;

        this.osc = this.context.createOscillator();
        this.env = this.context.createGain();
        this.env.gain.setValueAtTime(0, 0);
        this.gain = this.context.createGain();
        this.osc.connect(this.env).connect(this.gain).connect(this.context.destination);
        this.osc.start()
    }

    apply_params = () => {
        const now = this.context.currentTime;
        if (this.param("frequency") !== this.osc.frequency.value)
            this.osc.frequency.setValueAtTime(this.param("frequency"), now);
        if (this.param("amp") !== this.gain.gain.value)
            this.gain.gain.setValueAtTime(this.param("amp"), now);

        if (this.param("gate") >= .5) {
            this.env.gain.cancelScheduledValues(now);
            this.env.gain.linearRampToValueAtTime(1, now + this.param("attack"));
            this.env.gain.linearRampToValueAtTime(0, now + this.param("attack") + this.param("decay"));
        }
    };

    get_state = () => {
        return {
            ...this.get_modulated_param_values,
        };
    }
}
