import { describe, test, expect } from "vitest"
import * as khz from "./"

const A3 = 220
const Aflat4 = 415.305
const A4 = 440
const Asharp4 = 466.1639
const C5 = 523.2511306011972
const A5 = 880

describe("validateHz", () => {
  test("accepts positive finite numbers", () => {
    expect(() => khz.validateHz(1)).not.toThrow()
    expect(() => khz.validateHz(440)).not.toThrow()
    expect(() => khz.validateHz(0.0001)).not.toThrow()
  })
  test("throws on zero", () => {
    expect(() => khz.validateHz(0)).toThrow()
  })
  test("throws on negative numbers", () => {
    expect(() => khz.validateHz(-1)).toThrow()
    expect(() => khz.validateHz(-440)).toThrow()
  })
  test("throws on NaN", () => {
    expect(() => khz.validateHz(NaN)).toThrow()
  })
  test("throws on Infinity and -Infinity", () => {
    expect(() => khz.validateHz(Infinity)).toThrow()
    expect(() => khz.validateHz(-Infinity)).toThrow()
  })
  test("throws on non-number types", () => {
    // @ts-expect-error
    expect(() => khz.validateHz("440")).toThrow()
    // @ts-expect-error
    expect(() => khz.validateHz(null)).toThrow()
    // @ts-expect-error
    expect(() => khz.validateHz(undefined)).toThrow()
    // @ts-expect-error
    expect(() => khz.validateHz({})).toThrow()
  })
})
describe("from semitones", function () {
  describe("semitonesToCents", function () {
    ;[
      { input: 0, output: 0 },
      { input: -12, output: -1200 },
      { input: 12, output: 1200 },
    ].forEach(({ input, output }) => {
      test(`${input} → ${output}`, () => {
        expect(khz.semitonesToCents(input)).toBeCloseTo(output)
      })
    })
  })
  describe("semitonesToHz", function () {
    test("converts octaves", function () {
      expect(khz.semitonesToHz(12)).toEqual(A4 * 2)
      expect(khz.semitonesToHz(24)).toEqual(A4 * 4)
    })
    test("converts non-12 transposition", function () {
      expect(khz.semitonesToHz(3)).toBeCloseTo(C5)
    })
  })
  describe("semitonesToRatio", function () {
    ;[
      { input: 0, output: 1 },
      { input: -12, output: 0.5 },
      { input: 12, output: 2 },
      { input: 19.02, output: 3 },
    ].forEach(({ input, output }) => {
      test(`${input} → ${output}`, () => {
        expect(khz.semitonesToRatio(input)).toBeCloseTo(output)
      })
    })
  })
})
describe("from Hz", function () {
  describe("hzToRatio", function () {
    test("defaults to A4 for denominator", function () {
      expect(khz.hzToRatio(A5)).toBeCloseTo(2)
    })
    test("works on smaller numerator values", function () {
      expect(khz.hzToRatio(A4, A5)).toBeCloseTo(0.5)
    })
  })

  describe("hzToNoteObject", () => {
    test("basic", () => {
      expect(khz.hzToNoteObject(262).note).toBe("C")
      expect(khz.hzToNoteObject(262).octave).toBe(4)
      expect(khz.hzToNoteObject(440).note).toBe("A")
      expect(khz.hzToNoteObject(440).octave).toBe(4)
      expect(khz.hzToNoteObject(523).note).toBe("C")
      expect(khz.hzToNoteObject(523).octave).toBe(5)
      expect(khz.hzToNoteObject(8372).note).toBe("C")
      expect(khz.hzToNoteObject(8372).octave).toBe(9)
    })
    describe("extended range notes", () => {
      const tests = [
        { note: "C", octave: -2, hz: 4.088 },
        { note: "D", octave: -2, hz: 4.589 },
        { note: "F", octave: -2, hz: 5.457 },
        { note: "C", octave: -1, hz: 8.176 },
        { note: "E", octave: -1, hz: 10.03 },
        { note: "G♯", octave: -1, hz: 12.978 },
        { note: "A", octave: -1, hz: 13.75 },
        { note: "B", octave: -1, hz: 15.434 },
        { note: "B", octave: 10, hz: 31608.53 },
        { note: "B", octave: 12, hz: 126434.12 },
      ]
      tests.forEach(({ note, octave, hz }) => {
        test(`${hz} → ${note}${octave}`, () => {
          const result = khz.hzToNoteObject(hz)
          expect(result.note).toBe(note)
          expect(result.octave).toBe(octave)
        })
      })
    })
    test("exports correct negative detune in cents", () => {
      const Bflat = khz.hzToNoteObject(480)
      expect(Bflat.note).toBe("B")
      expect(Bflat.octave).toBe(4)
      expect(Bflat.detune).toBe(-49)
    })
    test("exports correct positive detune in cents", () => {
      const Bsharp = khz.hzToNoteObject(1000)
      expect(Bsharp.note).toBe("B")
      expect(Bsharp.octave).toBe(5)
      expect(Bsharp.detune).toEqual(21)
    })
  })
  describe("hzToNoteName", () => {
    describe("converts Hz to note name", () => {
      ;[
        { input: 262, output: "C" },
        { input: 440, output: "A" },
        { input: 523, output: "C" },
        { input: 8372, output: "C" },
      ].forEach(({ input, output }) => {
        test(`${input} → ${output}`, () => {
          expect(khz.hzToNoteName(input)).toBe(output)
        })
      })
    })
    describe("responds to rounding", () => {
      test(`260 → C`, () => expect(khz.hzToNoteName(260)).toBe("C"))
      test(`260 → B (floor)`, () =>
        expect(khz.hzToNoteName(260, "down")).toBe("B"))
      test(`263 → C`, () => expect(khz.hzToNoteName(263)).toBe("C"))
      test(`263 → C♯ (ceil)`, () =>
        expect(khz.hzToNoteName(263, "up")).toBe("C♯"))
    })
    describe("quantizeHz", () => {
      test("quantizing sharps", () => {
        const sharp = 450
        expect(khz.quantizeHz(sharp)).toBeCloseTo(A4)
        expect(khz.quantizeHz(sharp, "up")).toBeCloseTo(Asharp4)
      })
      test("quantizing flats", () => {
        const sharp = 430
        expect(khz.quantizeHz(sharp)).toBeCloseTo(A4)
        expect(khz.quantizeHz(sharp, "down")).toBeCloseTo(Aflat4)
      })
    })
  })
  describe("hzToSemitones", function () {
    test("works between octaves", function () {
      expect(khz.hzToSemitones(C5)).toBeCloseTo(+3)
    })
    test("works on positive octaves", function () {
      expect(khz.hzToSemitones(A4 * 2)).toEqual(+12)
      expect(khz.hzToSemitones(A4 * 2, A4 / 2)).toEqual(+24)
    })
    test("works on negative octaves", function () {
      expect(khz.hzToSemitones(A4 / 2)).toEqual(-12)
    })
  })
})
describe("from cents", function () {
  describe("centsToSemitones", function () {
    ;[
      { input: 0, output: 0 },
      { input: -1200, output: -12 },
      { input: 1200, output: 12 },
    ].forEach(({ input, output }) => {
      test(`${input} → ${output}`, () => {
        expect(khz.centsToSemitones(input)).toBeCloseTo(output)
      })
    })
  })
  describe("centsToRatio", function () {
    ;[
      { input: 0, output: 1 },
      { input: -1200, output: 0.5 },
      { input: 1200, output: 2 },
    ].forEach(({ input, output }) => {
      test(`${input} → ${output}`, () => {
        expect(khz.centsToRatio(input)).toBeCloseTo(output)
      })
    })
  })
  describe("centsToHz", function () {
    ;[
      { input: 0, output: 440 },
      { input: -1200, output: 220 },
      { input: 1200, output: 880 },
    ].forEach(({ input, output }) => {
      test(`${input} → ${output}`, () => {
        expect(khz.centsToHz(input)).toBeCloseTo(output)
      })
    })
  })
})
describe("formatHz", function () {
  ;[
    { input: 2, output: "2.00Hz" },
    { input: 2.325, output: "2.33Hz" },
    { input: 999, output: "999.00Hz" },
    { input: 1000, output: "1.00kHz" },
    { input: 2000, output: "2.00kHz" },
    { input: 20000, output: "20.00kHz" },
    { input: 200000, output: "200.00kHz" },
  ].forEach(({ input, output }) => {
    test(`${input} → ${output}`, () => {
      expect(khz.formatHz(input)).toBe(output)
    })
  })
  test("includes positive sign when specified", () => {
    expect(khz.formatHz(2340, undefined, true)).toBe("+2.34kHz")
  })
})

describe("from ratio", () => {
  describe("ratioToHz", () => {
    ;[
      { input: 2, output: 880 },
      { input: 3, output: 1320 },
      { input: 4, output: 1760 },
      { input: 0.5, output: 220 },
    ].forEach(({ input, output }) => {
      test(`${input} → ${output}`, () => {
        expect(khz.ratioToHz(input)).toBe(output)
      })
    })
  })
  describe("ratioToCents", () => {
    ;[
      { input: 2, output: 1200 },
      { input: 3, output: 1901.955 },
      { input: 4, output: 2400 },
      { input: 0.5, output: -1200 },
    ].forEach(({ input, output }) => {
      test(`${input} → ${output}`, () => {
        expect(khz.ratioToCents(input)).toBeCloseTo(output)
      })
    })
  })
  describe("ratioToSemitones", () => {
    test("converts multipliers to semitones", () => {
      expect(khz.ratioToSemitones(1.4983206107)).toBeCloseTo(7)
      expect(khz.ratioToSemitones(2.997)).toBeCloseTo(19)
      expect(khz.ratioToSemitones(4)).toBeCloseTo(24)
    })
    test("converts fractional ratios", () => {
      expect(khz.ratioToSemitones(3 / 2)).toBeCloseTo(7.02)
    })
  })
})
describe("from named note", () => {
  describe("cleanNoteName", () => {
    test("capitalizes", () => {
      expect(khz.cleanNoteName("c4")).toBe("C4")
      expect(khz.cleanNoteName("c♯4")).toBe("C♯4")
    })
    test("normalizes sharps", () => {
      expect(khz.cleanNoteName("c#4")).toBe("C♯4")
    })
    test("normalizes flats", () => {
      expect(khz.cleanNoteName("cb4")).toBe("C♭4")
      expect(khz.cleanNoteName("bb4")).toBe("B♭4")
    })
  })
  describe("getNoteIndexInOctave", function () {
    ;[
      { input: "C", output: -9 },
      { input: "C♯", output: -8 },
      { input: "D♭", output: -8 },
      { input: "D", output: -7 },
      { input: "E", output: -5 },
      { input: "F♭", output: -5 },
      { input: "E♯", output: -4 },
      { input: "F", output: -4 },
      { input: "G", output: -2 },
      { input: "A", output: 0 },
      { input: "B", output: 2 },
      { input: "C♭", output: 2 },
    ].forEach(({ input, output }) => {
      test(`${input} → ${output}`, () => {
        expect(khz.getNoteIndexInOctave(input)).toBe(output)
      })
    })
    // TODO: expect a throw on invalid note name
  })
  describe("namedNoteToSemitones", () => {
    test("C4", () => expect(khz.namedNoteToSemitones("C4")).toBe(-9))
    test("A♯3", () => expect(khz.namedNoteToSemitones("A♯3")).toBe(-11))
  })
  describe("namedNoteToCents", () => {
    test("C4", () => expect(khz.namedNoteToCents("C4")).toBe(-900))
    test("A♯3", () => expect(khz.namedNoteToCents("A♯3")).toBe(-1100))
  })
  describe("namedNoteToHz", () => {
    const tests = {
      "C-1": 8.176,
      "G#-1": 12.978,
      "A-1": 13.75,
      "B-1": 15.434,
      A0: 27.5,
      A1: 55,
      C4: 261.626,
      "C♯4": 277.183,
      D4: 293.665,
      "D♯4": 311.127,
      eb4: 311.127,
      E4: 329.628,
      F4: 349.228,
      "F♯4": 369.994,
      G4: 391.995,
      "G♯4": 415.305,
      A4: 440,
      "A♯4": 466.164,
      B4: 493.883,
      C5: 523.251,
      F5: 698.457,
      C8: 4186.009,
      C9: 8372.0181,
      B10: 31608.53,
    }
    Object.entries(tests).forEach(([note, hz]) => {
      test(`${note}`, () => {
        expect(khz.namedNoteToHz(note)).toBeCloseTo(hz)
      })
    })
    test("uses 4 in the absence of an explicit octave", () => {
      expect(khz.namedNoteToHz("C")).toBeCloseTo(261.63)
    })
  })
  describe("getNoteIndexInOctave", () => {
    test("throws on invalid note name", () => {
      expect(() => khz.getNoteIndexInOctave("H")).toThrow()
      expect(() => khz.getNoteIndexInOctave("")).toThrow()
    })
  })
  describe("cleanNoteName", () => {
    test("throws on invalid note name", () => {
      expect(() => khz.cleanNoteName("H#4")).toThrow()
      expect(() => khz.cleanNoteName("4C#")).toThrow()
    })
  })
  describe("hzToNoteName edge cases", () => {
    test("handles zero or negative Hz", () => {
      expect(() => khz.hzToNoteName(0)).toThrow()
      expect(() => khz.hzToNoteName(-440)).toThrow()
    })
    test("handles very high Hz", () => {
      expect(khz.hzToNoteName(1e6)).toBeDefined()
    })
  })
  describe("namedNoteToRatio", () => {
    test("A4", () => expect(khz.namedNoteToRatio("A4")).toBeCloseTo(1))
    test("A5", () => expect(khz.namedNoteToRatio("A5")).toBeCloseTo(2))
    test("A6", () => expect(khz.namedNoteToRatio("A6")).toBeCloseTo(4))
    test("A4:A3", () => expect(khz.namedNoteToRatio("A4", "A3")).toBeCloseTo(2))
  })
  describe("isNoteWhiteOnPiano", () => {
    ;[
      { input: "B", output: true },
      { input: "C4", output: true },
      { input: "A♯3", output: false },
      { input: "Cb4", output: true },
      { input: "E4", output: true },
      { input: "F#4", output: false },
    ].forEach(({ input, output }) => {
      test(`${input} → ${output}`, () => {
        expect(khz.isNoteWhiteOnPiano(input)).toBe(output)
      })
    })
  })
  describe("isNoteBlackOnPiano", () => {
    ;[
      { input: "B", output: false },
      { input: "C4", output: false },
      { input: "A♯3", output: true },
      { input: "Cb4", output: false },
      { input: "E4", output: false },
      { input: "F#4", output: true },
    ].forEach(({ input, output }) => {
      test(`${input} → ${output}`, () => {
        expect(khz.isNoteBlackOnPiano(input)).toBe(output)
      })
    })
  })
})
describe("Pitch class", () => {
  describe("initializers", () => {
    describe("constructor()", () => {
      test("initializes with A4", () => {
        expect(new khz.Pitch().hz).toBeCloseTo(440)
      })
    })
    describe(".fromNamedNote()", () => {
      test("initializes from NamedNote", () => {
        expect(khz.Pitch.fromNamedNote("A-1").hz).toBeCloseTo(13.75)
        expect(khz.Pitch.fromNamedNote("A2").hz).toBeCloseTo(110)
        expect(khz.Pitch.fromNamedNote("A3").hz).toBeCloseTo(220)
      })
    })
  })
  describe("getters", () => {
    test(".noteAbove/.noteBelow", () => {
      const pitch = new khz.Pitch(730)
      expect(pitch.closestNoteBelow.note).toBe("F")
      expect(pitch.noteObject.note).toBe("F♯")
      expect(pitch.closestNoteAbove.note).toBe("F♯")
    })
  })
  test(".hz updates", () => {
    expect(new khz.Pitch(440).modRatio(3 / 2).hz).toBeCloseTo((440 * 3) / 2)
  })
  describe("methods", () => {
    describe(".quantize()", () => {
      test("quantizing sharps", () => {
        const sharp = new khz.Pitch(450)
        expect(sharp.noteObject.note).toBe("A")
        expect(sharp.noteObject.octave).toBe(4)
        expect(sharp.noteObject.detune).toBeGreaterThan(0)
        sharp.quantize()
        expect(sharp.noteObject.note).toBe("A")
        expect(sharp.noteObject.octave).toBe(4)
        expect(sharp.noteObject.detune).toBe(0)
      })
    })
  })

  test("addSemitones and transpose", () => {
    const pitch = new khz.Pitch(440)
    pitch.addSemitones(12)
    expect(pitch.hz).toBeCloseTo(880)
    pitch.transpose(-12)
    expect(pitch.hz).toBeCloseTo(440)
  })
  test("addCents and detune", () => {
    const pitch = new khz.Pitch(440)
    pitch.addCents(1200)
    expect(pitch.hz).toBeCloseTo(880)
    pitch.detune(-1200)
    expect(pitch.hz).toBeCloseTo(440)
  })
  test("shift", () => {
    const pitch = new khz.Pitch(440)
    pitch.shift(10)
    expect(pitch.hz).toBeCloseTo(450)
    pitch.shift(-10)
    expect(pitch.hz).toBeCloseTo(440)
  })
  test("modRatio", () => {
    const pitch = new khz.Pitch(440)
    pitch.modRatio(2)
    expect(pitch.hz).toBeCloseTo(880)
    pitch.modRatio(0.5)
    expect(pitch.hz).toBeCloseTo(440)
  })
})
