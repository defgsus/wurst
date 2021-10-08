//                  0     1     2     3     4     5     6     7     8     9     10    11
export const NOTE_NAMES = ["c-", "c#", "d-", "d#", "e-", "f-", "f#", "g-", "g#", "a-", "a#", "b-"];

export const CHORDS = {
    "": [0, 4, 7],
    "m": [0, 3, 7],

    "6": [0, 4, 7, 9],
    "m6": [0, 3, 7, 9],

    "7": [0, 4, 7, 10],
    "m7": [0, 3, 7, 10],
    "maj7": [0, 4, 7, 11],

    "9": [0, 4, 7, 10, 14],
    "m9": [0, 3, 7, 10, 14],
    "maj9": [0, 4, 7, 11, 14],

    "dim": [0, 3, 6],
    "dim7": [0, 3, 6, 9],
    "aug": [0, 4, 8],
};

export function note_to_string(note) {
    if (typeof note === "object") {
        return note.map(note_to_string);
    }
    try {
        return NOTE_NAMES[note % 12].toUpperCase() + Math.floor(note / 12);
    }
    catch (e) {
        throw Error(`Can not convert note '${note}'`);
    }
}

export function string_to_note(s) {
    if (typeof s === "object") {
        return s.map(string_to_note);
    }
    try {
        const
            name_idx = NOTE_NAMES.indexOf(s.slice(0, 2).toLowerCase()),
            octave = parseInt(s.slice(2, 3));
        return name_idx + octave * 12;

    } catch (e) {
        throw Error(`Can not convert note '${s}'`);
    }
}