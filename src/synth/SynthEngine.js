import Sequence from "./Sequence";
import Voice from "./Voice";
import Modulatable from "./Modulatable";
import React from "react";


export default class SynthEngine extends Modulatable {

    constructor(context=null) {
        super({
            "bpm": {
                default: 120,
                min_value: 1,
                help: "Beats Per Minute"
            },
            "bar_length": {
                default: 4,
                min_value: 1,
                help: "length of a bar / measure"
            },
            "note_div": {
                default: 16,
                min_value: 1,
                help: "length of notes per bar as 1/X"
            }
        });
        this.tick = 0;
        this.playback_state = "stop";

        this.context = context || new AudioContext();
        this.voices = {
            //"1": new Voice(this, {note: 57, filter_frequency: 500, type: "sawtooth"}),
            "0": new Voice(this),
        };
        this.sequences = {
            "0": new Sequence(this, {values: [1, 0, 0, 0, 1, 0, 0, 0], target: "voice.0.gate"}),
            //"1": new Sequence(this, {values: [1, 0, 0, 1, 0, 0, 0], target: "voice.0.filter_gate", amp: 1000}),
            //"2": new Sequence(this, {values: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0], target: "voice.1.gate"}),
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
                if (!this.voices[key].params[name].no_target)
                    modulation_targets.push(`voice.${key}.${name}`);
        }
        for (const key of Object.keys(this.sequences)) {
            sequences[key] = this.sequences[key].get_state();
            sequences[key].id = key;
            for (const name of Object.keys(this.sequences[key].params))
                if (!this.sequences[key].params[name].no_target)
                    modulation_targets.push(`sequence.${key}.${name}`)
        }

        return {
            tick: this.tick,
            beat: [
                Math.floor(this.tick / this.params.bar_length.value) + 1,
                this.tick % this.params.bar_length.value + 1
            ],
            playback_state: this.playback_state,
            params: this.get_params_state(),
            voices: voices,
            sequences: sequences,
            modulation_targets,
        }
    };

    stop = () => {
        for (const key of Object.keys(this.voices)) {
            this.voices[key].stop();
        }
    };

    serialize = () => {
        const data = {
            tick: this.tick,
            params: this.get_param_values(),
            voices: {},
            sequences: {},
        };
        for (const key of Object.keys(this.voices)) {
            data.voices[key] = this.voices[key].serialize();
        }
        for (const key of Object.keys(this.sequences)) {
            data.sequences[key] = this.sequences[key].serialize();
        }
        return data;
    };

    deserialize = (data) => {
        this.stop();
        this.voices = {};
        this.sequences = {};
        this.tick = data.tick;
        this.set_modulatable_params(data.params);

        for (const key of Object.keys(data.voices)) {
            this.voices[key] = new Voice(this, data.voices[key].params);
        }

        for (const key of Object.keys(data.sequences)) {
            this.sequences[key] = new Sequence(this, data.sequences[key].params);
            // TODO: this is hacky, rather move to a (de-)serialization base
            this.sequences[key].tick = data.sequences[key].tick;
            this.sequences[key].index = data.sequences[key].index;
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

    add_voice = () => {
        const count = Object.keys(this.voices).length;
        this.voices[`${count}`] = new Voice(this);
    };

    add_sequence = () => {
        const count = Object.keys(this.sequences).length;
        this.sequences[`${count}`] = new Sequence(this);
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