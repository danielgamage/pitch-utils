/**
 * 
 * This (ESM)  module provides a collection of functions for converting between pitch and frequency units.
 * 
 * ## Installation
 * ```bash
 * npm install pitch-utils
 * ```
 * 
 * ## Usage
 * ```js
 * import { hzToSemitones } from "pitch-utils";
 * hzToSemitones(880, 440); // +12
 * ```
 * 
 * ## Conversion Overview
 * |                  | → hz                  | → ratio                  | → semitones                  | → cents                  | → named               | → note object          |
 * | :--------------- | :-------------------- | :----------------------- | :--------------------------- | :----------------------- | :-------------------- | :--------------------- |
 * | hz&nbsp;→        | _N/A_                 | {@link hzToRatio}        | {@link hzToSemitones}        | {@link hzToCents}        | {@link hzToNoteName}  | {@link hzToNoteObject} |
 * | ratio&nbsp;→     | {@link ratioToHz}     | _N/A_                    | {@link ratioToSemitones}     | {@link ratioToCents}     | _Unimplemented_       | _Unimplemented_        |
 * | semitones&nbsp;→ | {@link semitonesToHz} | {@link semitonesToRatio} | _N/A_                        | {@link semitonesToCents} | _Unimplemented_       | _Unimplemented_        |
 * | cents&nbsp;→     | {@link centsToHz}     | {@link centsToRatio}     | {@link centsToSemitones}     | _N/A_                    | _Unimplemented_       | _Unimplemented_        |
 * | named&nbsp;→     | {@link namedNoteToHz} | {@link namedNoteToRatio} | {@link namedNoteToSemitones} | {@link namedNoteToCents} | _N/A_                 | _Unimplemented_        |
 * 
 * @packageDocumentation
 */

// =====================
// types
// =====================
/**
 * A note name with its octave, e.g. `C4`, `A♯3`, `F♯5`.
 * Also accepts lowercase and keyboard-accessible accidentals like `bb3` and `b#3`.
 */
export type NoteName = string;

/**
 * A frequency ratio, e.g. `1.5`, `2`, `0.5`.
 * Supports positive numbers.
 */
export type Ratio = number;

/**
 * A semitone pitch offset, e.g. `+3`, `-5`, `0`.
 * Supports positive and negative numbers.
 */
export type Semitones = number;

/**
 * A granular pitch offset unit, e.g. `+100`, `-200`, `0`.
 * Supports positive and negative numbers.
 */
export type Cents = number

/**
 * A frequency unit reflecting the number of cycles per second, e.g. `440`, `523.2511`, or `1600` (1.6kHz).
 * Supports positive numbers.
 */
export type Hz = number;

/**
 * Integer pitch grouping, e.g. `-1`, `4`, `10`.
 */
export type Octave = number;

/**
 * Object with note properties for flexible formatting.
 */
export type NoteObject = {
  note: NoteName;
  octave: Octave;
  detune: Cents;
}

// =====================
// constants
// =====================

/**
 * A4 frequency in Hz
 */
export const A4 = 440;
/**
 * Normalized note names in the chromatic scale, using sharps
 */
export const chromaticScale = [
  "C",
  "C♯",
  "D",
  "D♯",
  "E",
  "F",
  "F♯",
  "G",
  "G♯",
  "A",
  "A♯",
  "B",
];
/**
 * Normalized note names in the chromatic scale, using flats
 */
export const chromaticScaleFlat = [
  "C",
  "D♭",
  "D",
  "E♭",
  "E",
  "F",
  "G♭",
  "G",
  "A♭",
  "A",
  "B♭",
  "B",
];

// =====================
// utils
// =====================
/**
 *
 */
export const getNoteIndexInOctave = (note: string) => {
  let scaleIndex = chromaticScale.indexOf(note);
  if (scaleIndex === -1) {
    scaleIndex = chromaticScaleFlat.indexOf(note);
  }
  // center around A4
  return -9 + scaleIndex;
};

/**
 * Replaces keyboard-accessible accidentals with their unicode equivalents and makes note name uppercase.
 * @example ```js
 * cleanNoteName("C#4") // "C♯4"
 * cleanNoteName("bb4") // "B♭4"
 * ```
 */
export function cleanNoteName(
  /** dirty note name, with name, optional accidental, and octave */
  dirtyNote: string
): string {
  return dirtyNote
    .replace(/([A-Za-z])(b)/g, "$1♭") // replace b with ♭
    .replace("#", "♯") // replace # with ♯
    .toUpperCase();
}

/**
 * formats a number in Hz to a string with kilohertz support
 * @example ```js
 * formatHz(232.5) // "232.50Hz"
 * formatHz(2325) // "2.33kHz"
 * ```
 */
export function formatHz(hz: Hz, precision = 2): string {
  if (hz >= 1000) {
    return `${(hz / 1000).toFixed(precision)}kHz`;
  }
  return `${hz.toFixed(precision)}Hz`;
}

// =====================
// from semitones
// =====================
/**
 * @example ```js
 * semitonesToHz(3) // 523.2511
 * semitonesToHz(-3, 523.2511) // 440
 * ```
 */
export function semitonesToHz(
  /** semitone offset */
  semitones: Semitones,
  /** optional base note */
  baseHz: Hz = A4
): Hz {
  return baseHz * Math.pow(2, semitones / 12);
}

/**
 * @example ```js
 * semitonesToCents(-12) // -1200
 * semitonesToCents(0.5) // 50
 * ```
 */
export function semitonesToCents(
  /**semitone offset*/
  semitones: Semitones
): Cents {
  return 100 * semitones;
}
/**
 * @example ```js
 * semitonesToRatio(12) // 2
 * semitonesToRatio(-12) // 0.5
 * ```
 */
export function semitonesToRatio(
  /** semitone offset */
  semitones: Semitones
): Ratio {
  return Math.pow(2, semitones / 12);
}

// =====================
// from cents
// =====================
/**
 * @example ```js
 * centsToSemitones(100) // +1
 * ```
 */
export function centsToSemitones(cents: Cents): Semitones {
  return cents / 100;
}
/**
 * @example ```js
 * centsToRatio(1200) // 2
 * ```
 */
export function centsToRatio(cents: Cents): Ratio {
  return semitonesToRatio(centsToSemitones(cents));
}
/**
 * @example ```js
 * centsToHz(1200) // 880
 * ```
 */
export function centsToHz(cents: Cents, baseHz: Hz = A4): Hz {
  return semitonesToHz(centsToSemitones(cents), baseHz);
}


// =====================
// from named note
// =====================
/**
 * @example ```js
 * namedNoteToSemitones("C4") // +3
 * namedNoteToSemitones("A♯3") // -11
 * ```
 */
export function namedNoteToSemitones(
  note: NoteName
): Semitones {
  const cleanNote = cleanNoteName(note);
  const noteIndex = getNoteIndexInOctave(cleanNote.replace(/-?[0-9]+/g, ""));

  let octave = 4;
  const octaveNumber = cleanNote.match(/-?[0-9]+/g)?.[0];
  if (octaveNumber && !Number.isNaN(parseInt(octaveNumber))) {
    octave = parseInt(octaveNumber);
  }
  const semitone = noteIndex + (octave - 4) * 12;
  return semitone;
}
/**
 * @example ```js
 * namedNoteToRatio("A4") // 1
 * namedNoteToRatio("A♯3") // 0.5
 * ```
 */
export function namedNoteToRatio(
  note: NoteName,
  baseNote: NoteName = "A4",
): Ratio {
  return namedNoteToHz(note) / namedNoteToHz(baseNote);
}
/**
 * @example ```js
 * namedNoteToCents("C4") // -900
 * ```
 */
export function namedNoteToCents(
  /** note name, e.g. C4, A♯3, F♯5 */
  note: NoteName
): Cents {
  return semitonesToCents(namedNoteToSemitones(note));
}

/**
 * @example ```js
 * namedNoteToHz("C4") // 261.6256
 * namedNoteToHz("A♯3") // 233.0819
 * ```
 */
export function namedNoteToHz(
  /** note name, e.g. C4, A♯3, F♯5 */
  note: NoteName
): Hz {
  return semitonesToHz(namedNoteToSemitones(note));
}

// =====================
// from ratio
// =====================
/**
 * @example ```js
 * ratioToSemitones(2) // 12
 * ratioToSemitones(3) // ~19.02
 * ```
 */
export function ratioToSemitones(
  /** decimal or fractional ratio */
  ratio: Ratio
): Semitones {
  return 12 * Math.log2(ratio);
}

/**
 * @example ```js
 * ratioToHz(2) // 880
 * ratioToHz(3) // 1320
 * ```
 */
export function ratioToHz(
  /** decimal or fractional ratio */
  ratio: Ratio,
  /** optional base note */
  baseHz: Hz = A4
): Hz {
  return ratio * baseHz;
}

/**
 * 
 * @example ```js
 * ratioToCents(2) // 1200
 * ratioToCents(3) // 1902
 * ```
 */
export function ratioToCents(
  /** decimal or fractional ratio */
  ratio: Ratio,
): Cents {
  return semitonesToCents(ratioToSemitones(ratio));
}

// =====================
// from Hz
// =====================
/**
 * @example ```js
 * hzToNoteName(260) // C
 * hzToNoteName(260, Math.floor) // B
 * hzToNoteName(263) // C
 * hzToNoteName(263, Math.ceil) // C♯
 * ```
 */
export function hzToNoteName(
  /** frequency of note in hertz */
  hz: Hz,
  /** whether to round up, down, or naturally */
  rounding:
    | typeof Math.round
    | typeof Math.floor
    | typeof Math.ceil = Math.round
): string {
  const note = rounding(12 * (Math.log(hz / 440) / Math.log(2))) + 69;
  return chromaticScale[note % 12];
}

export function hzToNoteObject(
  /** frequency of note in hertz */
  hz: Hz
): NoteObject {
  const semitone = 12 * (Math.log(hz / 440) / Math.log(2)) + 69;
  const round = Math.round(semitone);
  const centRemainder =
    (semitone % 1 > 0.5 ? -1 + (semitone % 1) : semitone % 1) * 100;
  return {
    note: hzToNoteName(hz),
    octave: Math.floor(round / 12 - 1),
    detune: Math.round(centRemainder),
  };
}

/**
 * 
 * @example ```js
 * hzToRatio(880) // 2
 * hzToRatio(440, 880) // 0.5
 * ```
 */
export function hzToRatio(
  /** target frequency in hertz */
  targetHz: Hz,
  /** base frequency in hertz */
  baseHz: Hz = A4
): Ratio {
  return targetHz / baseHz;
}

/**
 * @example ```js
 * hzToSemitones(880, 440) // -12
 * ```
 */
export function hzToSemitones(
  /** target frequency in hertz */
  targetHz: Hz,
  /** base frequency in hertz */
  baseHz: Hz = A4
): Semitones {
  return 12 * Math.log2(targetHz / baseHz);
}

/**
 * @example ```js
 * hzToCents(880, 440) // -1200
 * ```
 */
export function hzToCents(targetHz: Hz, baseHz: Hz = A4): Cents {
  return semitonesToCents(hzToSemitones(targetHz, baseHz));
}
