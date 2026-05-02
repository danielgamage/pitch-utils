
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
 * |                  | → hz                  | → ratio                  | → semitones                  | → cents                  | → midi                   | → named                     | → note object                 |
 * | :--------------- | :-------------------- | :----------------------- | :--------------------------- | :----------------------- | :----------------------- | :-------------------------- | :---------------------------- |
 * | hz&nbsp;→        | _N/A_                 | {@link hzToRatio}        | {@link hzToSemitones}        | {@link hzToCents}        | {@link hzToMidi}         | {@link hzToNoteName}        | {@link hzToNoteObject}        |
 * | ratio&nbsp;→     | {@link ratioToHz}     | _N/A_                    | {@link ratioToSemitones}     | {@link ratioToCents}     | {@link ratioToMidi}      | {@link ratioToNoteName}     | {@link ratioToNoteObject}     |
 * | semitones&nbsp;→ | {@link semitonesToHz} | {@link semitonesToRatio} | _N/A_                        | {@link semitonesToCents} | {@link semitonesToMidi}  | {@link semitonesToNoteName} | {@link semitonesToNoteObject} |
 * | cents&nbsp;→     | {@link centsToHz}     | {@link centsToRatio}     | {@link centsToSemitones}     | _N/A_                    | {@link centsToMidi}      | {@link centsToNoteName}     | {@link centsToNoteObject}     |
 * | midi&nbsp;→      | {@link midiToHz}      | {@link midiToRatio}      | {@link midiToSemitones}      | {@link midiToCents}      | _N/A_                    | {@link midiToNoteName}      | {@link midiToNoteObject}      |
 * | named&nbsp;→     | {@link namedNoteToHz} | {@link namedNoteToRatio} | {@link namedNoteToSemitones} | {@link namedNoteToCents} | {@link namedNoteToMidi}  | _N/A_                       | {@link namedNoteToNoteObject} |
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
export type NoteName = string

/**
 * A frequency ratio, e.g. `1.5`, `2`, `0.5`.
 * Supports positive numbers.
 */
export type Ratio = number

/**
 * A semitone pitch offset, e.g. `+3`, `-5`, `0`.
 * Supports positive and negative numbers.
 */
export type Semitones = number

/**
 * A granular pitch offset unit, e.g. `+100`, `-200`, `0`.
 * Supports positive and negative numbers.
 */
export type Cents = number

/**
 * A frequency unit reflecting the number of cycles per second, e.g. `440`, `523.2511`, or `1600` (1.6kHz).
 * Supports positive numbers.
 */
export type Hz = number

/**
 * Integer pitch grouping, e.g. `-1`, `4`, `10`.
 */
export type Octave = number

/**
 * Integer representation of pitch in [0, 127], e.g. `12` (C0), `69` (A4), `127` (G9).
 */
export type MIDINoteNumber = number

/**
 * Object with note properties for flexible formatting.
 */
export type NoteObject = {
  hz: Hz
  note: NoteName
  octave: Octave
  detune: Cents
}

/**
 * Rounding method for converting between frequency units.
 * @todo maybe eventually this can include hz rounding in addition to pitch rounding
 */
export type RoundingMethod = "nearest" | "up" | "down"

// =====================
// constants
// =====================

/**
 * A4 frequency in Hz
 */
export const A4 = 440
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
]
/**
 * Note names with alternate enharmonic names
 */
export const enharmonicChromaticScale = [
  ["C", "B♯", "D♭♭"],
  ["C♯", "D♭", "B♯♯"],
  ["D", "C♯♯", "E♭♭"],
  ["D♯", "E♭", "F♭♭"],
  ["E", "F♭", "D♯♯"],
  ["F", "E♯", "G♭♭"],
  ["F♯", "G♭", "E♯♯"],
  ["G", "F♯♯", "A♭♭"],
  ["G♯", "A♭"],
  ["A", "G♯♯", "B♭♭"],
  ["A♯", "B♭", "C♭♭"],
  ["B", "C♭", "A♯♯"],
]

// named note is black on keyboard
const whiteNoteOnPianoIndices = [0, 2, 4, 5, 7, 9, 11]
export const whiteNotesOnPiano = enharmonicChromaticScale
  .filter((el, i) => whiteNoteOnPianoIndices.includes(i))
  .flat()
export const blackNotesOnPiano = enharmonicChromaticScale
  .filter((el, i) => !whiteNoteOnPianoIndices.includes(i))
  .flat()

// =====================
// utils
// =====================

/**
 * Selects a Math.* rounding function based on RoundingMethod union type
 * @returns
 */
export const getRoundingFunction = (roundingMethod?: RoundingMethod) => {
  if (roundingMethod) {
    return {
      nearest: Math.round,
      up: Math.ceil,
      down: Math.floor,
    }[roundingMethod]
  } else {
    return Math.round
  }
}
/**
 *
 */
export const getNoteIndexInOctave = (note: string) => {
  let scaleIndex = enharmonicChromaticScale.findIndex((enharmonicNoteNames) => enharmonicNoteNames.includes(note))
  // center around A4
  if (scaleIndex > -1) {
    return -9 + scaleIndex
  } else {
    throw new Error("Invalid note name")
  }
}

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
  // Match: note letter, optional accidental(s), optional octave (e.g. C#4, dbb3, F♯♯5, etc.)
  const match = dirtyNote.match(/^([A-Ga-g])((?:b+|#+|♭+|♯+)*)\s*(-?\d+)?$/)
  if (!match) {
    throw new Error(`Invalid note name: "${dirtyNote}"`)
  }
  let [, letter, accidentals = "", octave = ""] = match

  // Replace all 'b' with '♭', all '#' with '♯', but keep explicit '♭' and '♯'
  accidentals = accidentals.replace(/b/g, "♭").replace(/#/g, "♯")

  // Uppercase note letter, keep accidentals and octave as is
  return `${letter.toUpperCase()}${accidentals}${octave}`
}

/**
 * Validates that a frequency value is a positive, non-zero number.
 * Throws an error if the value is zero, negative, or not a number.
 * @param hz The frequency in Hz to validate
 * @example ```js
 * validateHz(440) // passes
 * validateHz(0) // throws error
 * validateHz(-220) // throws error
 * validateHz(NaN) // throws error
 * ```
 */
export function validateHz(hz: Hz): asserts hz is Hz {
  if (typeof hz !== "number" || !Number.isFinite(hz) || hz <= 0) {
    throw new Error(`Hz value must be a positive, non-zero number. Received: ${hz}`)
  }
}

/**
 * Formats a number in Hz to a string with kilohertz support
 * Assumes tabular numeral usage, and includes trailing zeros for alignment.
 * @example ```js
 * formatHz(232.5) // "232.50Hz"
 * formatHz(2325) // "2.33kHz"
 * formatHz(2325, 2, true) // "+2.33kHz"
 * ```
 */
export function formatHz(
  hz: Hz,
  precision = 2,
  /** whether to include (+) signs */
  alwaysIncludeSign = false
): string {
  validateHz(hz)
  const addPlusSign = alwaysIncludeSign && hz >= 0
  let sign = addPlusSign ? "+" : ""
  if (hz >= 1000) {
    return `${sign}${(hz / 1000).toFixed(precision)}kHz`
  }
  return `${sign}${hz.toFixed(precision)}Hz`
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
  return baseHz * Math.pow(2, semitones / 12)
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
  return 100 * semitones
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
  return Math.pow(2, semitones / 12)
}

/**
 * Returns a MIDI note number relative to A4 (69).
 * @example ```js
 * semitonesToMidi(0) // 69
 * semitonesToMidi(12) // 81
 * ```
 */
export function semitonesToMidi(semitones: Semitones, roundingMethod?: RoundingMethod): MIDINoteNumber {
  return getRoundingFunction(roundingMethod)(semitones) + 69
}

export function semitonesToNoteName(semitones: Semitones, baseHz: Hz = A4): string {
  return hzToNoteName(semitonesToHz(semitones, baseHz))
}
export function semitonesToNoteObject(semitones: Semitones, baseHz: Hz = A4): NoteObject {
  return hzToNoteObject(semitonesToHz(semitones, baseHz))
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
  return cents / 100
}
/**
 * @example ```js
 * centsToRatio(1200) // 2
 * ```
 */
export function centsToRatio(cents: Cents): Ratio {
  return semitonesToRatio(centsToSemitones(cents))
}
/**
 * @example ```js
 * centsToHz(1200) // 880
 * ```
 */
export function centsToHz(cents: Cents, baseHz: Hz = A4): Hz {
  return semitonesToHz(centsToSemitones(cents), baseHz)
}

/**
 * @example ```js
 * centsToMidi(0) // 69
 * centsToMidi(1200) // 81
 * ```
 */
export function centsToMidi(cents: Cents, roundingMethod?: RoundingMethod): MIDINoteNumber {
  return semitonesToMidi(centsToSemitones(cents), roundingMethod)
}

/**
 * @example ```js
 * centsToNoteName(0) // "A"
 * centsToNoteName(1200) // "A"
 * ```
 */
export function centsToNoteName(cents: Cents): string {
  return hzToNoteName(centsToHz(cents))
}
/**
 * @example ```js
 * centsToNoteObject(0) // {note: "A", octave: 4, hz: 440, detune: 0}
 * centsToNoteObject(1200) // {note: "A", octave: 5, hz: 880, detune: 0}
 * ```
 */
export function centsToNoteObject(cents: Cents): NoteObject {
  return hzToNoteObject(centsToHz(cents))
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
export function namedNoteToSemitones(note: NoteName): Semitones {
  const cleanNote = cleanNoteName(note)
  const noteIndex = getNoteIndexInOctave(cleanNote.replace(/-?[0-9]+/g, ""))

  let octave = 4
  const octaveNumber = cleanNote.match(/-?[0-9]+/g)?.[0]
  if (octaveNumber && !Number.isNaN(parseInt(octaveNumber))) {
    octave = parseInt(octaveNumber)
  }
  const semitone = noteIndex + (octave - 4) * 12
  return semitone
}
/**
 * @example ```js
 * namedNoteToRatio("A4") // 1
 * namedNoteToRatio("A♯3") // 0.5
 * ```
 */
export function namedNoteToRatio(
  note: NoteName,
  baseNote: NoteName = "A4"
): Ratio {
  return namedNoteToHz(note) / namedNoteToHz(baseNote)
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
  return semitonesToCents(namedNoteToSemitones(note))
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
  return semitonesToHz(namedNoteToSemitones(note))
}

/**
 * @example ```js
 * namedNoteToMidi("A4") // 69
 * namedNoteToMidi("C4") // 60
 * ```
 */
export function namedNoteToMidi(note: NoteName): MIDINoteNumber {
  return semitonesToMidi(namedNoteToSemitones(note))
}

export function namedNoteToNoteObject(note: NoteName): NoteObject {
  return hzToNoteObject(namedNoteToHz(note))
}

/**
 * @example ```js
 * isNoteWhiteOnPiano("C4") // true
 * isNoteWhiteOnPiano("A♯3") // false
 * ```
 */
export const isNoteWhiteOnPiano = (note: NoteName) =>
  whiteNotesOnPiano.includes(cleanNoteName(note).replace(/\d/g, ""))

/**
 * @example ```js
 * isNoteBlackOnPiano("Cb4") // false
 * isNoteBlackOnPiano("A♯3") // true
 * ```
 */
export const isNoteBlackOnPiano = (note: NoteName) =>
  blackNotesOnPiano.includes(cleanNoteName(note).replace(/\d/g, ""))

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
  return 12 * Math.log2(ratio)
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
  return ratio * baseHz
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
  ratio: Ratio
): Cents {
  return semitonesToCents(ratioToSemitones(ratio))
}

export function ratioToNoteName(ratio: Ratio): string {
  return hzToNoteName(ratioToHz(ratio))
}
export function ratioToNoteObject(ratio: Ratio): NoteObject {
  return hzToNoteObject(ratioToHz(ratio))
}

/**
 * @example ```js
 * ratioToMidi(1) // 69
 * ratioToMidi(2) // 81
 * ```
 */
export function ratioToMidi(ratio: Ratio, roundingMethod?: RoundingMethod): MIDINoteNumber {
  return semitonesToMidi(ratioToSemitones(ratio), roundingMethod)
}

// =====================
// from MIDI
// =====================

/**
 * @example ```js
 * midiToSemitones(69) // 0
 * midiToSemitones(81) // +12
 * ```
 */
export function midiToSemitones(midi: MIDINoteNumber): Semitones {
  return midi - 69
}
/**
 * @example ```js
 * midiToHz(69) // 440
 * midiToHz(60) // 261.62...
 * ```
 */
export function midiToHz(midi: MIDINoteNumber): Hz {
  return semitonesToHz(midiToSemitones(midi))
}
/**
 * @example ```js
 * midiToCents(69) // 0
 * midiToCents(81) // 1200
 * ```
 */
export function midiToCents(midi: MIDINoteNumber): Cents {
  return semitonesToCents(midiToSemitones(midi))
}
/**
 * @example ```js
 * midiToRatio(81) // 2
 * midiToRatio(69) // 1
 * ```
 */
export function midiToRatio(midi: MIDINoteNumber): Ratio {
  return semitonesToRatio(midiToSemitones(midi))
}
export function midiToNoteName(
  midi: MIDINoteNumber,
  roundingMethod?: RoundingMethod
): string {
  return hzToNoteName(midiToHz(midi), roundingMethod)
}
export function midiToNoteObject(midi: MIDINoteNumber): NoteObject {
  return hzToNoteObject(midiToHz(midi))
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
  roundingMethod?: RoundingMethod
): string {
  validateHz(hz)
  const note =
    getRoundingFunction(roundingMethod)(
      12 * (Math.log(hz / 440) / Math.log(2))
    ) + 69
  const noteName = chromaticScale.at((note + 12 * 1000) % 12)
  if (noteName) {
    return noteName
  } else {
    throw new Error("Could not determine note name for hz: " + hz)
  }
}

export function hzToNoteObject(
  /** frequency of note in hertz */
  hz: Hz
): NoteObject {
  validateHz(hz)
  const semitone = 12 * (Math.log(hz / 440) / Math.log(2)) + 69
  const round = Math.round(semitone)
  const centRemainder =
    (semitone % 1 > 0.5 ? -1 + (semitone % 1) : semitone % 1) * 100
  return {
    hz,
    note: hzToNoteName(hz),
    octave: Math.floor(round / 12 - 1),
    detune: Math.round(centRemainder),
  }
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
  validateHz(targetHz)
  validateHz(baseHz)
  return targetHz / baseHz
}

/**
 * When a baseHz is provided, returns the difference in semitones
 * @example ```js
 * hzToSemitones(880, 440) // +12
 * ```
 */
export function hzToSemitones(
  /** target frequency in hertz */
  targetHz: Hz,
  /** base frequency in hertz */
  baseHz: Hz = A4
): Semitones {
  validateHz(targetHz)
  validateHz(baseHz)
  return 12 * Math.log2(targetHz / baseHz)
}

/**
 * When a baseHz is provided, returns the difference in cents
 * @example ```js
 * hzToCents(880, 440) // +1200
 * ```
 */
export function hzToCents(targetHz: Hz, baseHz: Hz = A4): Cents {
  validateHz(targetHz)
  validateHz(baseHz)
  return semitonesToCents(hzToSemitones(targetHz, baseHz))
}

/**
 * @example ```js
 * hzToMidi(440) // 69
 * hzToMidi(880) // 81
 * ```
 */
export function hzToMidi(hz: Hz, roundingMethod?: RoundingMethod): MIDINoteNumber {
  validateHz(hz)
  return semitonesToMidi(hzToSemitones(hz), roundingMethod)
}

/**
 * @example ```js
 * quantizeHz(450) // 440
 * quantizeHz(450, "down") // 440
 * quantizeHz(450, "up") // ~466.17
 * ```
 */
export function quantizeHz(
  hz: Hz,
  roundingMethod?: RoundingMethod
): Hz {
  validateHz(hz)
  const semitones = hzToSemitones(hz)
  const snappedSemitones = getRoundingFunction(roundingMethod)(semitones)
  return semitonesToHz(snappedSemitones)
}

/**
 * @example ```js
 * const note = new Pitch(440)
 * note.noteObject.note // "A4"
 * note.modRatio(3/1)
 * note.noteObject.note // "E6"
 * ```
 */
export class Pitch {
  /**
   * base value for calculations
   */
  hz: Hz

  constructor(initializer: {
    hz: Hz
  } | {
    namedNote: NoteName
  } | {
    midi: MIDINoteNumber
  } = { hz: A4 }) {
    if ("namedNote" in initializer) {
      this.hz = namedNoteToHz(initializer.namedNote)
    } else if ("midi" in initializer) {
      this.hz = midiToHz(initializer.midi)
    } else {
      validateHz(initializer.hz)
      this.hz = initializer.hz
    }
  }

  /** Creates a new instance to preserve source pitch while branching off a new chainable pitch. */
  clone() {
    return new Pitch({ hz: this.hz })
  }

  // Getters for various representations of the pitch

  /** @example for A4, `69` */
  get midi(): MIDINoteNumber {
    return hzToMidi(this.hz)
  }

  get noteObject(): NoteObject {
    return hzToNoteObject(this.hz)
  }
  /** @example for A4, `4` */
  get octave(): Octave {
    return this.noteObject.octave
  }
  /** @example for A4, `"A"` */
  get noteName(): NoteName {
    return this.noteObject.note
  }
  /** @example for A4, `0` */
  get detuning(): Cents {
    return this.noteObject.detune
  }
  get isSharp(): boolean {
    return this.detuning > 0
  }
  get isFlat(): boolean {
    return this.detuning < 0
  }

  // Related notes
  
  /** Returns the nearest note below */
  get closestNoteBelow(): NoteObject {
    const snappedSemitones = Math.floor(hzToSemitones(this.hz))
    const snappedHz = semitonesToHz(snappedSemitones)
    return hzToNoteObject(snappedHz)
  }
  /** Returns the nearest note above */
  get closestNoteAbove(): NoteObject {
    const snappedSemitones = Math.ceil(hzToSemitones(this.hz))
    const snappedHz = semitonesToHz(snappedSemitones)
    return hzToNoteObject(snappedHz)
  }

  // Chainable actions / mutations

  /** Snaps the current pitch to the nearest semitone */
  quantize(roundingMethod?: RoundingMethod) {
    this.hz = quantizeHz(this.hz, roundingMethod)
    return this
  }
  /** Transposes the current pitch by a number of semitones */
  addSemitones(semitones: Semitones) {
    this.hz = semitonesToHz(semitones, this.hz)
    return this
  }
  /** Transposes the current pitch by a number of semitones */
  transpose = this.addSemitones
  /** Shifts the current pitch by a number of hertz */
  addHz(hz: Hz) {
    this.hz += hz
    return this
  }
  shift = this.addHz
  /** Detunes the current pitch by a number of cents */
  addCents(cents: Cents) {
    this.hz = centsToHz(cents, this.hz)
    return this
  }
  detune = this.addCents
  /** Modulates the current pitch by a ratio */
  multiply(ratio: Ratio) {
    this.hz = ratioToHz(ratio, this.hz)
    return this
  }
  modRatio = this.multiply

  // Comparators

  // Semitone comparators
  /** How many semitones is it from the other pitch? */
  semitonesFrom(other: Pitch | Hz): Semitones {
    const otherHz = other instanceof Pitch ? other.hz : other
    return hzToSemitones(this.hz, otherHz)
  }
  /** How many semitones is it to the other pitch? */
  semitonesTo(other: Pitch | Hz): Semitones {
    const otherHz = other instanceof Pitch ? other.hz : other
    return hzToSemitones(otherHz, this.hz)
  }

  // Cents comparators
  /** How many cents is it from the other pitch? */
  centsFrom(other: Pitch | Hz): Cents {
    const otherHz = other instanceof Pitch ? other.hz : other
    return hzToCents(this.hz, otherHz)
  }
  /** How many cents is it to the other pitch? */
  centsTo(other: Pitch | Hz): Cents {
    const otherHz = other instanceof Pitch ? other.hz : other
    return hzToCents(otherHz, this.hz)
  }
  
  // Ratio comparators
  /** What interval ratio is it from the other pitch? */
  ratioFrom(other: Pitch | Hz): Ratio {
    const otherHz = other instanceof Pitch ? other.hz : other
    return hzToRatio(this.hz, otherHz)
  }
  /** What interval ratio is it to the other pitch? */
  ratioTo(other: Pitch | Hz): Ratio {
    const otherHz = other instanceof Pitch ? other.hz : other
    return hzToRatio(otherHz, this.hz)
  }
}

