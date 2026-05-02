<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [pitch-utils](#pitch-utils)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Conversion Overview](#conversion-overview)
  - [Classes](#classes)
  - [Type Aliases](#type-aliases)
    - [Cents](#cents)
    - [Hz](#hz)
    - [MIDINoteNumber](#midinotenumber)
    - [NoteName](#notename)
    - [NoteObject](#noteobject)
    - [Octave](#octave)
    - [Ratio](#ratio)
    - [RoundingMethod](#roundingmethod)
    - [Semitones](#semitones)
  - [Variables](#variables)
    - [A4](#a4)
    - [blackNotesOnPiano](#blacknotesonpiano)
    - [chromaticScale](#chromaticscale)
    - [enharmonicChromaticScale](#enharmonicchromaticscale)
    - [whiteNotesOnPiano](#whitenotesonpiano)
  - [Functions](#functions)
    - [centsToHz](#centstohz)
    - [centsToMidi](#centstomidi)
    - [centsToNoteName](#centstonotename)
    - [centsToNoteObject](#centstonoteobject)
    - [centsToRatio](#centstoratio)
    - [centsToSemitones](#centstosemitones)
    - [cleanNoteName](#cleannotename)
    - [formatHz](#formathz)
    - [getNoteIndexInOctave](#getnoteindexinoctave)
    - [getRoundingFunction](#getroundingfunction)
    - [hzToCents](#hztocents)
    - [hzToMidi](#hztomidi)
    - [hzToNoteName](#hztonotename)
    - [hzToNoteObject](#hztonoteobject)
    - [hzToRatio](#hztoratio)
    - [hzToSemitones](#hztosemitones)
    - [isNoteBlackOnPiano](#isnoteblackonpiano)
    - [isNoteWhiteOnPiano](#isnotewhiteonpiano)
    - [midiToCents](#miditocents)
    - [midiToHz](#miditohz)
    - [midiToNoteName](#miditonotename)
    - [midiToNoteObject](#miditonoteobject)
    - [midiToRatio](#miditoratio)
    - [midiToSemitones](#miditosemitones)
    - [namedNoteToCents](#namednotetocents)
    - [namedNoteToHz](#namednotetohz)
    - [namedNoteToMidi](#namednotetomidi)
    - [namedNoteToNoteObject](#namednotetonoteobject)
    - [namedNoteToRatio](#namednotetoratio)
    - [namedNoteToSemitones](#namednotetosemitones)
    - [quantizeHz](#quantizehz)
    - [ratioToCents](#ratiotocents)
    - [ratioToHz](#ratiotohz)
    - [ratioToMidi](#ratiotomidi)
    - [ratioToNoteName](#ratiotonotename)
    - [ratioToNoteObject](#ratiotonoteobject)
    - [ratioToSemitones](#ratiotosemitones)
    - [semitonesToCents](#semitonestocents)
    - [semitonesToHz](#semitonestohz)
    - [semitonesToMidi](#semitonestomidi)
    - [semitonesToNoteName](#semitonestonotename)
    - [semitonesToNoteObject](#semitonestonoteobject)
    - [semitonesToRatio](#semitonestoratio)
    - [validateHz](#validatehz)
- [Classes](#classes-1)
  - [Class: Pitch](#class-pitch)
    - [Constructors](#constructors)
    - [Properties](#properties)
    - [Accessors](#accessors)
    - [Methods](#methods)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<a name="modulesmd"></a>

# pitch-utils

This (ESM)  module provides a collection of functions for converting between pitch and frequency units.

## Installation
```bash
npm install pitch-utils
```

## Usage
```js
import { hzToSemitones } from "pitch-utils";
hzToSemitones(880, 440); // +12
```

## Conversion Overview
|                  | → hz                  | → ratio                  | → semitones                  | → cents                  | → midi                   | → named                     | → note object                 |
| :--------------- | :-------------------- | :----------------------- | :--------------------------- | :----------------------- | :----------------------- | :-------------------------- | :---------------------------- |
| hz&nbsp;→        | _N/A_                 | [hzToRatio](#hztoratio)        | [hzToSemitones](#hztosemitones)        | [hzToCents](#hztocents)        | [hzToMidi](#hztomidi)         | [hzToNoteName](#hztonotename)        | [hzToNoteObject](#hztonoteobject)        |
| ratio&nbsp;→     | [ratioToHz](#ratiotohz)     | _N/A_                    | [ratioToSemitones](#ratiotosemitones)     | [ratioToCents](#ratiotocents)     | [ratioToMidi](#ratiotomidi)      | [ratioToNoteName](#ratiotonotename)     | [ratioToNoteObject](#ratiotonoteobject)     |
| semitones&nbsp;→ | [semitonesToHz](#semitonestohz) | [semitonesToRatio](#semitonestoratio) | _N/A_                        | [semitonesToCents](#semitonestocents) | [semitonesToMidi](#semitonestomidi)  | [semitonesToNoteName](#semitonestonotename) | [semitonesToNoteObject](#semitonestonoteobject) |
| cents&nbsp;→     | [centsToHz](#centstohz)     | [centsToRatio](#centstoratio)     | [centsToSemitones](#centstosemitones)     | _N/A_                    | [centsToMidi](#centstomidi)      | [centsToNoteName](#centstonotename)     | [centsToNoteObject](#centstonoteobject)     |
| midi&nbsp;→      | [midiToHz](#miditohz)      | [midiToRatio](#miditoratio)      | [midiToSemitones](#miditosemitones)      | [midiToCents](#miditocents)      | _N/A_                    | [midiToNoteName](#miditonotename)      | [midiToNoteObject](#miditonoteobject)      |
| named&nbsp;→     | [namedNoteToHz](#namednotetohz) | [namedNoteToRatio](#namednotetoratio) | [namedNoteToSemitones](#namednotetosemitones) | [namedNoteToCents](#namednotetocents) | [namedNoteToMidi](#namednotetomidi)  | _N/A_                       | [namedNoteToNoteObject](#namednotetonoteobject) |

## Classes

- [Pitch](#classespitchmd)

## Type Aliases

### Cents

Ƭ **Cents**: `number`

A granular pitch offset unit, e.g. `+100`, `-200`, `0`.
Supports positive and negative numbers.

#### Defined in

[src/index.ts:55](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L55)

___

### Hz

Ƭ **Hz**: `number`

A frequency unit reflecting the number of cycles per second, e.g. `440`, `523.2511`, or `1600` (1.6kHz).
Supports positive numbers.

#### Defined in

[src/index.ts:61](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L61)

___

### MIDINoteNumber

Ƭ **MIDINoteNumber**: `number`

Integer representation of pitch in [0, 127], e.g. `12` (C0), `69` (A4), `127` (G9).

#### Defined in

[src/index.ts:71](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L71)

___

### NoteName

Ƭ **NoteName**: `string`

A note name with its octave, e.g. `C4`, `A♯3`, `F♯5`.
Also accepts lowercase and keyboard-accessible accidentals like `bb3` and `b#3`.

#### Defined in

[src/index.ts:37](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L37)

___

### NoteObject

Ƭ **NoteObject**: `Object`

Object with note properties for flexible formatting.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `detune` | [`Cents`](#cents) |
| `hz` | [`Hz`](#hz) |
| `note` | [`NoteName`](#notename) |
| `octave` | [`Octave`](#octave) |

#### Defined in

[src/index.ts:76](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L76)

___

### Octave

Ƭ **Octave**: `number`

Integer pitch grouping, e.g. `-1`, `4`, `10`.

#### Defined in

[src/index.ts:66](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L66)

___

### Ratio

Ƭ **Ratio**: `number`

A frequency ratio, e.g. `1.5`, `2`, `0.5`.
Supports positive numbers.

#### Defined in

[src/index.ts:43](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L43)

___

### RoundingMethod

Ƭ **RoundingMethod**: ``"nearest"`` \| ``"up"`` \| ``"down"``

Rounding method for converting between frequency units.

**`Todo`**

maybe eventually this can include hz rounding in addition to pitch rounding

#### Defined in

[src/index.ts:87](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L87)

___

### Semitones

Ƭ **Semitones**: `number`

A semitone pitch offset, e.g. `+3`, `-5`, `0`.
Supports positive and negative numbers.

#### Defined in

[src/index.ts:49](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L49)

## Variables

### A4

• `Const` **A4**: ``440``

A4 frequency in Hz

#### Defined in

[src/index.ts:96](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L96)

___

### blackNotesOnPiano

• `Const` **blackNotesOnPiano**: `string`[]

#### Defined in

[src/index.ts:137](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L137)

___

### chromaticScale

• `Const` **chromaticScale**: `string`[]

Normalized note names in the chromatic scale, using sharps

#### Defined in

[src/index.ts:100](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L100)

___

### enharmonicChromaticScale

• `Const` **enharmonicChromaticScale**: `string`[][]

Note names with alternate enharmonic names

#### Defined in

[src/index.ts:117](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L117)

___

### whiteNotesOnPiano

• `Const` **whiteNotesOnPiano**: `string`[]

#### Defined in

[src/index.ts:134](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L134)

## Functions

### centsToHz

▸ **centsToHz**(`cents`, `baseHz?`): [`Hz`](#hz)

**`Example`**

```js
centsToHz(1200) // 880
```

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `cents` | `number` | `undefined` |
| `baseHz` | `number` | `A4` |

#### Returns

[`Hz`](#hz)

#### Defined in

[src/index.ts:324](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L324)

___

### centsToMidi

▸ **centsToMidi**(`cents`, `roundingMethod?`): [`MIDINoteNumber`](#midinotenumber)

**`Example`**

```js
centsToMidi(0) // 69
centsToMidi(1200) // 81
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `cents` | `number` |
| `roundingMethod?` | [`RoundingMethod`](#roundingmethod) |

#### Returns

[`MIDINoteNumber`](#midinotenumber)

#### Defined in

[src/index.ts:334](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L334)

___

### centsToNoteName

▸ **centsToNoteName**(`cents`): `string`

**`Example`**

```js
centsToNoteName(0) // "A"
centsToNoteName(1200) // "A"
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `cents` | `number` |

#### Returns

`string`

#### Defined in

[src/index.ts:344](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L344)

___

### centsToNoteObject

▸ **centsToNoteObject**(`cents`): [`NoteObject`](#noteobject)

**`Example`**

```js
centsToNoteObject(0) // {note: "A", octave: 4, hz: 440, detune: 0}
centsToNoteObject(1200) // {note: "A", octave: 5, hz: 880, detune: 0}
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `cents` | `number` |

#### Returns

[`NoteObject`](#noteobject)

#### Defined in

[src/index.ts:353](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L353)

___

### centsToRatio

▸ **centsToRatio**(`cents`): [`Ratio`](#ratio)

**`Example`**

```js
centsToRatio(1200) // 2
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `cents` | `number` |

#### Returns

[`Ratio`](#ratio)

#### Defined in

[src/index.ts:316](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L316)

___

### centsToSemitones

▸ **centsToSemitones**(`cents`): [`Semitones`](#semitones)

**`Example`**

```js
centsToSemitones(100) // +1
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `cents` | `number` |

#### Returns

[`Semitones`](#semitones)

#### Defined in

[src/index.ts:308](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L308)

___

### cleanNoteName

▸ **cleanNoteName**(`dirtyNote`): `string`

Replaces keyboard-accessible accidentals with their unicode equivalents and makes note name uppercase.

**`Example`**

```js
cleanNoteName("C#4") // "C♯4"
cleanNoteName("bb4") // "B♭4"
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `dirtyNote` | `string` | dirty note name, with name, optional accidental, and octave |

#### Returns

`string`

#### Defined in

[src/index.ts:180](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L180)

___

### formatHz

▸ **formatHz**(`hz`, `precision?`, `alwaysIncludeSign?`): `string`

Formats a number in Hz to a string with kilohertz support
Assumes tabular numeral usage, and includes trailing zeros for alignment.

**`Example`**

```js
formatHz(232.5) // "232.50Hz"
formatHz(2325) // "2.33kHz"
formatHz(2325, 2, true) // "+2.33kHz"
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `hz` | `number` | `undefined` | - |
| `precision` | `number` | `2` | - |
| `alwaysIncludeSign` | `boolean` | `false` | whether to include (+) signs |

#### Returns

`string`

#### Defined in

[src/index.ts:224](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L224)

___

### getNoteIndexInOctave

▸ **getNoteIndexInOctave**(`note`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `note` | `string` |

#### Returns

`number`

#### Defined in

[src/index.ts:163](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L163)

___

### getRoundingFunction

▸ **getRoundingFunction**(`roundingMethod?`): (`x`: `number`) => `number`

Selects a Math.* rounding function based on RoundingMethod union type

#### Parameters

| Name | Type |
| :------ | :------ |
| `roundingMethod?` | [`RoundingMethod`](#roundingmethod) |

#### Returns

`fn`

▸ (`x`): `number`

Returns a supplied numeric expression rounded to the nearest integer.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `number` | The value to be rounded to the nearest integer. |

##### Returns

`number`

#### Defined in

[src/index.ts:149](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L149)

___

### hzToCents

▸ **hzToCents**(`targetHz`, `baseHz?`): [`Cents`](#cents)

When a baseHz is provided, returns the difference in cents

**`Example`**

```js
hzToCents(880, 440) // +1200
```

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `targetHz` | `number` | `undefined` |
| `baseHz` | `number` | `A4` |

#### Returns

[`Cents`](#cents)

#### Defined in

[src/index.ts:647](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L647)

___

### hzToMidi

▸ **hzToMidi**(`hz`, `roundingMethod?`): [`MIDINoteNumber`](#midinotenumber)

**`Example`**

```js
hzToMidi(440) // 69
hzToMidi(880) // 81
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `hz` | `number` |
| `roundingMethod?` | [`RoundingMethod`](#roundingmethod) |

#### Returns

[`MIDINoteNumber`](#midinotenumber)

#### Defined in

[src/index.ts:659](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L659)

___

### hzToNoteName

▸ **hzToNoteName**(`hz`, `roundingMethod?`): `string`

**`Example`**

```js
hzToNoteName(260) // C
hzToNoteName(260, Math.floor) // B
hzToNoteName(263) // C
hzToNoteName(263, Math.ceil) // C♯
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hz` | `number` | frequency of note in hertz |
| `roundingMethod?` | [`RoundingMethod`](#roundingmethod) | whether to round up, down, or naturally |

#### Returns

`string`

#### Defined in

[src/index.ts:570](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L570)

___

### hzToNoteObject

▸ **hzToNoteObject**(`hz`): [`NoteObject`](#noteobject)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hz` | `number` | frequency of note in hertz |

#### Returns

[`NoteObject`](#noteobject)

#### Defined in

[src/index.ts:589](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L589)

___

### hzToRatio

▸ **hzToRatio**(`targetHz`, `baseHz?`): [`Ratio`](#ratio)

**`Example`**

```js
hzToRatio(880) // 2
hzToRatio(440, 880) // 0.5
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `targetHz` | `number` | `undefined` | target frequency in hertz |
| `baseHz` | `number` | `A4` | base frequency in hertz |

#### Returns

[`Ratio`](#ratio)

#### Defined in

[src/index.ts:613](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L613)

___

### hzToSemitones

▸ **hzToSemitones**(`targetHz`, `baseHz?`): [`Semitones`](#semitones)

When a baseHz is provided, returns the difference in semitones

**`Example`**

```js
hzToSemitones(880, 440) // +12
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `targetHz` | `number` | `undefined` | target frequency in hertz |
| `baseHz` | `number` | `A4` | base frequency in hertz |

#### Returns

[`Semitones`](#semitones)

#### Defined in

[src/index.ts:630](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L630)

___

### isNoteBlackOnPiano

▸ **isNoteBlackOnPiano**(`note`): `boolean`

**`Example`**

```js
isNoteBlackOnPiano("Cb4") // false
isNoteBlackOnPiano("A♯3") // true
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `note` | `string` |

#### Returns

`boolean`

#### Defined in

[src/index.ts:444](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L444)

___

### isNoteWhiteOnPiano

▸ **isNoteWhiteOnPiano**(`note`): `boolean`

**`Example`**

```js
isNoteWhiteOnPiano("C4") // true
isNoteWhiteOnPiano("A♯3") // false
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `note` | `string` |

#### Returns

`boolean`

#### Defined in

[src/index.ts:435](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L435)

___

### midiToCents

▸ **midiToCents**(`midi`): [`Cents`](#cents)

**`Example`**

```js
midiToCents(69) // 0
midiToCents(81) // 1200
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `midi` | `number` |

#### Returns

[`Cents`](#cents)

#### Defined in

[src/index.ts:537](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L537)

___

### midiToHz

▸ **midiToHz**(`midi`): [`Hz`](#hz)

**`Example`**

```js
midiToHz(69) // 440
midiToHz(60) // 261.62...
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `midi` | `number` |

#### Returns

[`Hz`](#hz)

#### Defined in

[src/index.ts:528](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L528)

___

### midiToNoteName

▸ **midiToNoteName**(`midi`, `roundingMethod?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `midi` | `number` |
| `roundingMethod?` | [`RoundingMethod`](#roundingmethod) |

#### Returns

`string`

#### Defined in

[src/index.ts:549](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L549)

___

### midiToNoteObject

▸ **midiToNoteObject**(`midi`): [`NoteObject`](#noteobject)

#### Parameters

| Name | Type |
| :------ | :------ |
| `midi` | `number` |

#### Returns

[`NoteObject`](#noteobject)

#### Defined in

[src/index.ts:555](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L555)

___

### midiToRatio

▸ **midiToRatio**(`midi`): [`Ratio`](#ratio)

**`Example`**

```js
midiToRatio(81) // 2
midiToRatio(69) // 1
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `midi` | `number` |

#### Returns

[`Ratio`](#ratio)

#### Defined in

[src/index.ts:546](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L546)

___

### midiToSemitones

▸ **midiToSemitones**(`midi`): [`Semitones`](#semitones)

**`Example`**

```js
midiToSemitones(69) // 0
midiToSemitones(81) // +12
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `midi` | `number` |

#### Returns

[`Semitones`](#semitones)

#### Defined in

[src/index.ts:519](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L519)

___

### namedNoteToCents

▸ **namedNoteToCents**(`note`): [`Cents`](#cents)

**`Example`**

```js
namedNoteToCents("C4") // -900
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `note` | `string` | note name, e.g. C4, A♯3, F♯5 |

#### Returns

[`Cents`](#cents)

#### Defined in

[src/index.ts:395](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L395)

___

### namedNoteToHz

▸ **namedNoteToHz**(`note`): [`Hz`](#hz)

**`Example`**

```js
namedNoteToHz("C4") // 261.6256
namedNoteToHz("A♯3") // 233.0819
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `note` | `string` | note name, e.g. C4, A♯3, F♯5 |

#### Returns

[`Hz`](#hz)

#### Defined in

[src/index.ts:408](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L408)

___

### namedNoteToMidi

▸ **namedNoteToMidi**(`note`): [`MIDINoteNumber`](#midinotenumber)

**`Example`**

```js
namedNoteToMidi("A4") // 69
namedNoteToMidi("C4") // 60
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `note` | `string` |

#### Returns

[`MIDINoteNumber`](#midinotenumber)

#### Defined in

[src/index.ts:421](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L421)

___

### namedNoteToNoteObject

▸ **namedNoteToNoteObject**(`note`): [`NoteObject`](#noteobject)

#### Parameters

| Name | Type |
| :------ | :------ |
| `note` | `string` |

#### Returns

[`NoteObject`](#noteobject)

#### Defined in

[src/index.ts:425](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L425)

___

### namedNoteToRatio

▸ **namedNoteToRatio**(`note`, `baseNote?`): [`Ratio`](#ratio)

**`Example`**

```js
namedNoteToRatio("A4") // 1
namedNoteToRatio("A♯3") // 0.5
```

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `note` | `string` | `undefined` |
| `baseNote` | `string` | `"A4"` |

#### Returns

[`Ratio`](#ratio)

#### Defined in

[src/index.ts:384](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L384)

___

### namedNoteToSemitones

▸ **namedNoteToSemitones**(`note`): [`Semitones`](#semitones)

**`Example`**

```js
namedNoteToSemitones("C4") // +3
namedNoteToSemitones("A♯3") // -11
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `note` | `string` |

#### Returns

[`Semitones`](#semitones)

#### Defined in

[src/index.ts:366](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L366)

___

### quantizeHz

▸ **quantizeHz**(`hz`, `roundingMethod?`): [`Hz`](#hz)

**`Example`**

```js
quantizeHz(450) // 440
quantizeHz(450, "down") // 440
quantizeHz(450, "up") // ~466.17
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `hz` | `number` |
| `roundingMethod?` | [`RoundingMethod`](#roundingmethod) |

#### Returns

[`Hz`](#hz)

#### Defined in

[src/index.ts:671](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L671)

___

### ratioToCents

▸ **ratioToCents**(`ratio`): [`Cents`](#cents)

**`Example`**

```js
ratioToCents(2) // 1200
ratioToCents(3) // 1902
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ratio` | `number` | decimal or fractional ratio |

#### Returns

[`Cents`](#cents)

#### Defined in

[src/index.ts:485](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L485)

___

### ratioToHz

▸ **ratioToHz**(`ratio`, `baseHz?`): [`Hz`](#hz)

**`Example`**

```js
ratioToHz(2) // 880
ratioToHz(3) // 1320
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `ratio` | `number` | `undefined` | decimal or fractional ratio |
| `baseHz` | `number` | `A4` | optional base note |

#### Returns

[`Hz`](#hz)

#### Defined in

[src/index.ts:469](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L469)

___

### ratioToMidi

▸ **ratioToMidi**(`ratio`, `roundingMethod?`): [`MIDINoteNumber`](#midinotenumber)

**`Example`**

```js
ratioToMidi(1) // 69
ratioToMidi(2) // 81
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `ratio` | `number` |
| `roundingMethod?` | [`RoundingMethod`](#roundingmethod) |

#### Returns

[`MIDINoteNumber`](#midinotenumber)

#### Defined in

[src/index.ts:505](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L505)

___

### ratioToNoteName

▸ **ratioToNoteName**(`ratio`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ratio` | `number` |

#### Returns

`string`

#### Defined in

[src/index.ts:492](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L492)

___

### ratioToNoteObject

▸ **ratioToNoteObject**(`ratio`): [`NoteObject`](#noteobject)

#### Parameters

| Name | Type |
| :------ | :------ |
| `ratio` | `number` |

#### Returns

[`NoteObject`](#noteobject)

#### Defined in

[src/index.ts:495](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L495)

___

### ratioToSemitones

▸ **ratioToSemitones**(`ratio`): [`Semitones`](#semitones)

**`Example`**

```js
ratioToSemitones(2) // 12
ratioToSemitones(3) // ~19.02
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ratio` | `number` | decimal or fractional ratio |

#### Returns

[`Semitones`](#semitones)

#### Defined in

[src/index.ts:456](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L456)

___

### semitonesToCents

▸ **semitonesToCents**(`semitones`): [`Cents`](#cents)

**`Example`**

```js
semitonesToCents(-12) // -1200
semitonesToCents(0.5) // 50
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `semitones` | `number` | semitone offset |

#### Returns

[`Cents`](#cents)

#### Defined in

[src/index.ts:263](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L263)

___

### semitonesToHz

▸ **semitonesToHz**(`semitones`, `baseHz?`): [`Hz`](#hz)

**`Example`**

```js
semitonesToHz(3) // 523.2511
semitonesToHz(-3, 523.2511) // 440
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `semitones` | `number` | `undefined` | semitone offset |
| `baseHz` | `number` | `A4` | optional base note |

#### Returns

[`Hz`](#hz)

#### Defined in

[src/index.ts:248](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L248)

___

### semitonesToMidi

▸ **semitonesToMidi**(`semitones`, `roundingMethod?`): [`MIDINoteNumber`](#midinotenumber)

Returns a MIDI note number relative to A4 (69).

**`Example`**

```js
semitonesToMidi(0) // 69
semitonesToMidi(12) // 81
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `semitones` | `number` |
| `roundingMethod?` | [`RoundingMethod`](#roundingmethod) |

#### Returns

[`MIDINoteNumber`](#midinotenumber)

#### Defined in

[src/index.ts:289](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L289)

___

### semitonesToNoteName

▸ **semitonesToNoteName**(`semitones`, `baseHz?`): `string`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `semitones` | `number` | `undefined` |
| `baseHz` | `number` | `A4` |

#### Returns

`string`

#### Defined in

[src/index.ts:293](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L293)

___

### semitonesToNoteObject

▸ **semitonesToNoteObject**(`semitones`, `baseHz?`): [`NoteObject`](#noteobject)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `semitones` | `number` | `undefined` |
| `baseHz` | `number` | `A4` |

#### Returns

[`NoteObject`](#noteobject)

#### Defined in

[src/index.ts:296](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L296)

___

### semitonesToRatio

▸ **semitonesToRatio**(`semitones`): [`Ratio`](#ratio)

**`Example`**

```js
semitonesToRatio(12) // 2
semitonesToRatio(-12) // 0.5
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `semitones` | `number` | semitone offset |

#### Returns

[`Ratio`](#ratio)

#### Defined in

[src/index.ts:275](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L275)

___

### validateHz

▸ **validateHz**(`hz`): asserts hz is number

Validates that a frequency value is a positive, non-zero number.
Throws an error if the value is zero, negative, or not a number.

**`Example`**

```js
validateHz(440) // passes
validateHz(0) // throws error
validateHz(-220) // throws error
validateHz(NaN) // throws error
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hz` | `number` | The frequency in Hz to validate |

#### Returns

asserts hz is number

#### Defined in

[src/index.ts:209](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L209)


# Classes


<a name="classespitchmd"></a>

## Class: Pitch

**`Example`**

```js
const note = new Pitch(440)
note.noteObject.note // "A4"
note.modRatio(3/1)
note.noteObject.note // "E6"
```

### Constructors

#### constructor

• **new Pitch**(`initializer?`)

##### Parameters

| Name | Type |
| :------ | :------ |
| `initializer` | { `hz`: `number`  } \| { `namedNote`: `string`  } \| { `midi`: `number`  } |

##### Defined in

[src/index.ts:695](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L695)

### Properties

#### detune

• **detune**: (`cents`: `number`) => [`Pitch`](#classespitchmd)

##### Type declaration

▸ (`cents`): [`Pitch`](#classespitchmd)

Detunes the current pitch by a number of cents

###### Parameters

| Name | Type |
| :------ | :------ |
| `cents` | `number` |

###### Returns

[`Pitch`](#classespitchmd)

##### Defined in

[src/index.ts:786](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L786)

___

#### hz

• **hz**: `number`

base value for calculations

##### Defined in

[src/index.ts:693](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L693)

___

#### modRatio

• **modRatio**: (`ratio`: `number`) => [`Pitch`](#classespitchmd)

##### Type declaration

▸ (`ratio`): [`Pitch`](#classespitchmd)

Modulates the current pitch by a ratio

###### Parameters

| Name | Type |
| :------ | :------ |
| `ratio` | `number` |

###### Returns

[`Pitch`](#classespitchmd)

##### Defined in

[src/index.ts:792](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L792)

___

#### shift

• **shift**: (`hz`: `number`) => [`Pitch`](#classespitchmd)

##### Type declaration

▸ (`hz`): [`Pitch`](#classespitchmd)

Shifts the current pitch by a number of hertz

###### Parameters

| Name | Type |
| :------ | :------ |
| `hz` | `number` |

###### Returns

[`Pitch`](#classespitchmd)

##### Defined in

[src/index.ts:780](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L780)

___

#### transpose

• **transpose**: (`semitones`: `number`) => [`Pitch`](#classespitchmd)

##### Type declaration

▸ (`semitones`): [`Pitch`](#classespitchmd)

Transposes the current pitch by a number of semitones

###### Parameters

| Name | Type |
| :------ | :------ |
| `semitones` | `number` |

###### Returns

[`Pitch`](#classespitchmd)

##### Defined in

[src/index.ts:774](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L774)

### Accessors

#### closestNoteAbove

• `get` **closestNoteAbove**(): [`NoteObject`](#noteobject)

Returns the nearest note above

##### Returns

[`NoteObject`](#noteobject)

##### Defined in

[src/index.ts:755](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L755)

___

#### closestNoteBelow

• `get` **closestNoteBelow**(): [`NoteObject`](#noteobject)

Returns the nearest note below

##### Returns

[`NoteObject`](#noteobject)

##### Defined in

[src/index.ts:749](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L749)

___

#### detuning

• `get` **detuning**(): `number`

**`Example`**

```ts
for A4, `0`
```

##### Returns

`number`

##### Defined in

[src/index.ts:736](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L736)

___

#### isFlat

• `get` **isFlat**(): `boolean`

##### Returns

`boolean`

##### Defined in

[src/index.ts:742](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L742)

___

#### isSharp

• `get` **isSharp**(): `boolean`

##### Returns

`boolean`

##### Defined in

[src/index.ts:739](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L739)

___

#### midi

• `get` **midi**(): `number`

**`Example`**

```ts
for A4, `69`
```

##### Returns

`number`

##### Defined in

[src/index.ts:720](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L720)

___

#### noteName

• `get` **noteName**(): `string`

**`Example`**

```ts
for A4, `"A"`
```

##### Returns

`string`

##### Defined in

[src/index.ts:732](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L732)

___

#### noteObject

• `get` **noteObject**(): [`NoteObject`](#noteobject)

##### Returns

[`NoteObject`](#noteobject)

##### Defined in

[src/index.ts:724](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L724)

___

#### octave

• `get` **octave**(): `number`

**`Example`**

```ts
for A4, `4`
```

##### Returns

`number`

##### Defined in

[src/index.ts:728](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L728)

### Methods

#### addCents

▸ **addCents**(`cents`): [`Pitch`](#classespitchmd)

Detunes the current pitch by a number of cents

##### Parameters

| Name | Type |
| :------ | :------ |
| `cents` | `number` |

##### Returns

[`Pitch`](#classespitchmd)

##### Defined in

[src/index.ts:782](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L782)

___

#### addHz

▸ **addHz**(`hz`): [`Pitch`](#classespitchmd)

Shifts the current pitch by a number of hertz

##### Parameters

| Name | Type |
| :------ | :------ |
| `hz` | `number` |

##### Returns

[`Pitch`](#classespitchmd)

##### Defined in

[src/index.ts:776](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L776)

___

#### addSemitones

▸ **addSemitones**(`semitones`): [`Pitch`](#classespitchmd)

Transposes the current pitch by a number of semitones

##### Parameters

| Name | Type |
| :------ | :------ |
| `semitones` | `number` |

##### Returns

[`Pitch`](#classespitchmd)

##### Defined in

[src/index.ts:769](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L769)

___

#### centsFrom

▸ **centsFrom**(`other`): `number`

How many cents is it from the other pitch?

##### Parameters

| Name | Type |
| :------ | :------ |
| `other` | `number` \| [`Pitch`](#classespitchmd) |

##### Returns

`number`

##### Defined in

[src/index.ts:810](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L810)

___

#### centsTo

▸ **centsTo**(`other`): `number`

How many cents is it to the other pitch?

##### Parameters

| Name | Type |
| :------ | :------ |
| `other` | `number` \| [`Pitch`](#classespitchmd) |

##### Returns

`number`

##### Defined in

[src/index.ts:815](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L815)

___

#### clone

▸ **clone**(): [`Pitch`](#classespitchmd)

Creates a new instance to preserve source pitch while branching off a new chainable pitch.

##### Returns

[`Pitch`](#classespitchmd)

##### Defined in

[src/index.ts:713](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L713)

___

#### multiply

▸ **multiply**(`ratio`): [`Pitch`](#classespitchmd)

Modulates the current pitch by a ratio

##### Parameters

| Name | Type |
| :------ | :------ |
| `ratio` | `number` |

##### Returns

[`Pitch`](#classespitchmd)

##### Defined in

[src/index.ts:788](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L788)

___

#### quantize

▸ **quantize**(`roundingMethod?`): [`Pitch`](#classespitchmd)

Snaps the current pitch to the nearest semitone

##### Parameters

| Name | Type |
| :------ | :------ |
| `roundingMethod?` | [`RoundingMethod`](#roundingmethod) |

##### Returns

[`Pitch`](#classespitchmd)

##### Defined in

[src/index.ts:764](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L764)

___

#### ratioFrom

▸ **ratioFrom**(`other`): `number`

What interval ratio is it from the other pitch?

##### Parameters

| Name | Type |
| :------ | :------ |
| `other` | `number` \| [`Pitch`](#classespitchmd) |

##### Returns

`number`

##### Defined in

[src/index.ts:822](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L822)

___

#### ratioTo

▸ **ratioTo**(`other`): `number`

What interval ratio is it to the other pitch?

##### Parameters

| Name | Type |
| :------ | :------ |
| `other` | `number` \| [`Pitch`](#classespitchmd) |

##### Returns

`number`

##### Defined in

[src/index.ts:827](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L827)

___

#### semitonesFrom

▸ **semitonesFrom**(`other`): `number`

How many semitones is it from the other pitch?

##### Parameters

| Name | Type |
| :------ | :------ |
| `other` | `number` \| [`Pitch`](#classespitchmd) |

##### Returns

`number`

##### Defined in

[src/index.ts:798](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L798)

___

#### semitonesTo

▸ **semitonesTo**(`other`): `number`

How many semitones is it to the other pitch?

##### Parameters

| Name | Type |
| :------ | :------ |
| `other` | `number` \| [`Pitch`](#classespitchmd) |

##### Returns

`number`

##### Defined in

[src/index.ts:803](https://github.com/danielgamage/pitch-utils/blob/494b81f/src/index.ts#L803)
