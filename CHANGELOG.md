## v0.5.0
### NEW
- `(new Pitch()).clone()` returns a copy for preserving previous value and returning a new Pitch instance
- `(new Pitch()).detuning` (cents)
- `(new Pitch()).isSharp` (boolean)
- `(new Pitch()).isFlat` (boolean)
- `(new Pitch()).addHz()`
- `(new Pitch()).multiply()`

### IMPROVEMENTS
- `enharmonicChromaticScale` now includes double-sharps/double-flats
- allowed `getRoundingFunction` to receive `undefined`

### BREAKING
- `Pitch` constructor now accepts an argument of either:
  ```ts
  {
    hz: Hz
  } | {
    namedNote: NoteName
  } | {
    midi: MIDINoteNumber
  } 
  ```
  and still defaults to `{hz: 440}`
- removed `fromNamedNote` and `fromMidi` in favor of the above construction. modifications can still be chained after that
  ```javascript
  - const pitch = Pitch.fromNamedNote("A3")
  + const pitch = new Pitch({namedNote: "A3"})
  ```
  ```javascript
  - const pitch = Pitch.fromMidi(69)
  + const pitch = new Pitch({midi: 69})
  ```

## v0.4.0
- Hz-related inputs now validate the argument before calculating
- `getRoundingFunction` now returns Math.round if some broken argument is passed in
- `Pitch` class additions:
  - instantiation via `Pitch.fromMidi()` (like `fromNamedNote`)
  - `octave`
  - `noteName`
  - removed the following A4-relative getters:
    - `.semitones`
    - `.cents`
    - `.ratio`
  - added the following methods to be relative to another `Pitch` instance or Hz:
    - `.semitonesFrom`
    - `.semitonesTo`
    - `.centsFrom`
    - `.centsTo`
    - `.ratioFrom`
    - `.ratioTo`
- New conversions
  - `semitonesToNoteName`
  - `semitonesToNoteObject`
  - `centsToNoteName`
  - `centsToNoteObject`
  - `namedNoteToNoteObject`
  - `ratioToNoteName`
  - `ratioToNoteObject`
- adding `roundingMethod` argument to MIDI-related functions