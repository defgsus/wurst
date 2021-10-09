import Sequence from "./Sequence";
import Voice from "./Voice";
import Modulatable from "./Modulatable";


export default class SynthEngine extends Modulatable {

    constructor(context=null) {
        super({
            "bpm": {
                default: 120,
                help: "Beats Per Minute"
            },
            "bar_length": {
                default: 4,
                help: "length of a bar / measure"
            },
            "note_div": {
                default: 8,
                help: "length of notes per bar as 1/X"
            }
        });
        this.tick = 0;
        this.playback_state = "stop";

        this.context = context || new AudioContext();
        this.voices = {
            "0": new Voice(this, {frequency: 300}),
            "1": new Voice(this),
        };
        this.sequences = {
            "0": new Sequence(this, {values: [1, 0, 0, 0, 1, 0, 0, 0], target: "voice.0.gate"}),
            "1": new Sequence(this, {values: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0], target: "voice.1.gate"}),
            "2": new Sequence(this, {values: [1, 0, 0, 1, 0, 0, 0], target: "voice.1.amp"}),
        };

   }

    get_state = () => {
        const modulation_targets = [];
        const voices = {};
        const sequences = {};

        for (const name of Object.keys(this.params))
            modulation_targets.push(`main.${name}`);

        for (const key of Object.keys(this.voices)) {
            voices[key] = this.voices[key].get_state();
            voices[key].id = key;
            for (const name of Object.keys(this.voices[key].params))
                modulation_targets.push(`voice.${key}.${name}`);
        }
        for (const key of Object.keys(this.sequences)) {
            sequences[key] = this.sequences[key].get_state();
            sequences[key].id = key;
            for (const name of Object.keys(this.sequences[key].params))
                modulation_targets.push(`sequence.${key}.${name}`)
        }

        return {
            tick: this.tick,
            playback_state: this.playback_state,
            params: this.get_params_state(),
            voices: voices,
            sequences: sequences,
            modulation_targets,
        }
    };

    apply_tick = () => {
        this.tick += 1;

        for (const id of Object.keys(this.sequences)) {
            const seq = this.sequences[id];
            seq.apply_tick();
        }
        this.pass_all_modulation();

        for (const id of Object.keys(this.voices)) {
            const voice = this.voices[id];
            voice.apply_params();
        }
    };

    reset_tick = () => {
        this.tick = 0;

        for (const id of Object.keys(this.sequences)) {
            const seq = this.sequences[id];
            seq.reset_tick();
        }

        this.pass_all_modulation()
    };

    apply_transport_signal = (signal) => {
        let new_state;
        if (signal === "play") {
            if (this.playback_state === "stop")
                new_state = "play";
            else if (this.playback_state === "play")
                new_state = "stop";
        }
        else if (signal === "stop") {
            if (this.playback_state === "play")
                new_state = "stop";
            else if (this.playback_state === "stop") {
                this.reset_tick();
            }
        }

        if (new_state) {
            this.playback_state = new_state;

            if (new_state === "play") {
                // trigger the gates
                this.pass_all_modulation();
            }
        }
    };

    set_main_param = (name, value) => {
        if (!this.set_modulatable_param(name, value)) {
            throw `No valid main param: ${name}`;
        }
    };

    set_voice_param = (id, name, value) => {
        this.voices[id].set_param(name, value);
    };

    set_sequence_param = (id, name, value) => {
        this.sequences[id].set_param(name, value);
    };

    set_sequence_value = (id, index, value) => {
        this.sequences[id].set_value(index, value);
    };

    reset_all_modulation = () => {
        this.reset_modulation();
        for (const id of Object.keys(this.voices))
            this.voices[id].reset_modulation();
        for (const id of Object.keys(this.sequences))
            this.sequences[id].reset_modulation();
    };

    pass_all_modulation = () => {
        this.reset_all_modulation();

        for (const id of Object.keys(this.sequences)) {
            const seq = this.sequences[id];
            if (seq.index !== seq.last_index) {
                this._pass_modulation_value(seq.get_value(), seq.params.target.value);
                seq.last_index = seq.index;
            }
        }
    };

    _pass_modulation_value = (value, target) => {
        target = target.split(".");

        switch (target[0]) {
            case "main":
                this.add_modulation_value(target[1], value);
                break;
            case "voice":
                this.voices[target[1]].add_modulation_value(target[2], value);
                break;
            case "sequence":
                this.sequences[target[1]].add_modulation_value(target[2], value);
                break;
        }
    }
}