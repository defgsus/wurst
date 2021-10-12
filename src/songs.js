
export const DEMO01 = {
    "tick": 0,
    "params": {"bpm": 160, "bar_length": 4, "note_div": 16},
    "voices": {
        "0": {
            "params": {
                "gate": 0,
                "type": "sine",
                "note": 23.82,
                "frequency": 0,
                "frequency_gate": 0,
                "frequency_envelope": 343.75,
                "frequency_attack": 10,
                "frequency_decay": 117.19,
                "amp": 0.5,
                "attack": 10,
                "decay": 500,
                "filter_frequency": 22000,
                "filter_gate": 0,
                "filter_envelope": 1000,
                "filter_attack": 10,
                "filter_decay": 200
            }
        },
        "1": {
            "params": {
                "gate": 0,
                "type": "sawtooth",
                "note": 92.28,
                "frequency": 0,
                "frequency_gate": 0,
                "frequency_envelope": 1000,
                "frequency_attack": 10,
                "frequency_decay": 312.5,
                "amp": 0.5,
                "attack": 10,
                "decay": 55.68,
                "filter_frequency": 22000,
                "filter_gate": 0,
                "filter_envelope": 1000,
                "filter_attack": 10,
                "filter_decay": 200
            }
        }
    },
    "sequences": {
        "0": {
            "tick": 669,
            "index": 5,
            "params": {
                "length": 8,
                "speed_div": 1,
                "target": "voice.0.gate",
                "values": [1, 0, 0, 0, 1, 0, 0, 0],
                "amp": 1
            }
        },
        "1": {
            "tick": 669,
            "index": 5,
            "params": {
                "length": 8,
                "speed_div": 1,
                "target": "voice.0.frequency_gate",
                "values": [1, 0, 0, 0, 1, 0, 0, 0],
                "amp": 1
            }
        },
        "2": {
            "tick": 669,
            "index": 5,
            "params": {
                "length": 8,
                "speed_div": 1,
                "target": "voice.1.gate",
                "values": [1, 0, 1, 0, 1, 0, 1, 0],
                "amp": 1
            }
        },
        "3": {
            "tick": 395,
            "index": 5,
            "params": {
                "length": 10,
                "speed_div": 1,
                "target": "voice.1.decay",
                "values": [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
                "amp": 100
            }
        }
    }
};
