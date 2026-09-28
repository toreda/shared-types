[![Toreda](https://content.toreda.com/logo/toreda-logo.png)](https://www.toreda.com)

[![CI](https://img.shields.io/github/actions/workflow/status/toreda/shared-types/ci.yml?branch=master&style=for-the-badge)](https://github.com/toreda/shared-types/actions/workflows/ci.yml) [![GitHub issues](https://img.shields.io/github/issues/toreda/shared-types?style=for-the-badge)](https://github.com/toreda/shared-types/issues)

[![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/toreda/shared-types/master?style=for-the-badge)](https://github.com/toreda/shared-types/releases/latest) [![GitHub Release Date](https://img.shields.io/github/release-date/toreda/shared-types?style=for-the-badge)](https://github.com/toreda/shared-types/releases/latest) 

 [![license](https://img.shields.io/github/license/toreda/shared-types?style=for-the-badge)](https://github.com/toreda/shared-types/blob/master/LICENSE)

&nbsp;

# `@toreda/shared-types`

Common shared types and expressive aliases for TypeScript packages.

&nbsp;

# Contents
- [`@toreda/shared-types`](#toredashared-types)
- [Contents](#contents)
- [Install](#install)
	- [Module formats](#module-formats)
- [Runtime helpers](#runtime-helpers)
	- [`typeValue`](#typevalue)
	- [`logLike`](#loglike)
	- [`Runnable`](#runnable)
	- [`Defaults`](#defaults)
- [Object API](#object-api)
	- [`Resettable`](#resettable)
	- [`Clearable`](#clearable)
	- [`Stringable`](#stringable)
	- [Interface reference](#interface-reference)
- [Functional Types](#functional-types)
	- [`DeepRequired<T>`](#deeprequiredt)
	- [`Primitive`](#primitive)
	- [Functional type reference](#functional-type-reference)
- [Expressive Types](#expressive-types)
	- [`BitMask`](#bitmask)
	- [Expressive type reference](#expressive-type-reference)
- [Legal](#legal)
	- [License](#license)
	- [Copyright](#copyright)
	- [Website](#website)

&nbsp;

# Install

```bash
pnpm add @toreda/shared-types
```

or

```bash
npm install @toreda/shared-types
```

## Module formats
The package ships both CommonJS and ESM builds and selects one through its `exports` map. `require` and `import` both work from plain Node and from bundlers. Type declarations are included for each build and resolve under the `node`, `node16`, `nodenext` and `bundler` module resolution settings.

```typescript
// ESM
import {typeValue} from '@toreda/shared-types';
import type {Nullable} from '@toreda/shared-types';
```

```javascript
// CommonJS
const {typeValue} = require('@toreda/shared-types');
```

Only the package root is exported. Import everything from `@toreda/shared-types`, not from paths inside `dist/`.

Most exports are types only and add nothing to your bundle. The runtime exports are `typeValue`, `logLike`, `Runnable` and `Defaults`.

&nbsp;

# Runtime helpers

## `typeValue`
Returns the first value that passes a type guard, or `fallback` when none do.

```typescript
import {typeValue} from '@toreda/shared-types';

const isString = (v: unknown): v is string => typeof v === 'string';

typeValue(isString, 'default', 11, null, 'hello'); // 'hello'
typeValue(isString, 'default', 11, null); // 'default'
```

The test function has the type `TypeValueTest<ValueT>`.

## `logLike`
Type guard that checks whether a value has the `LogLike` shape: `error`, `warn`, `info`, `debug` and `trace` methods. The global `console` and a `@toreda/log` `Log` instance both pass.

```typescript
import {logLike} from '@toreda/shared-types';
import type {LogLike} from '@toreda/shared-types';

function getLogger(value: unknown): LogLike {
	return logLike(value) ? value : console;
}
```

## `Runnable`
Wraps a sync or async task with an ID. `run()` always resolves to a `RunnableOutcome` and never throws. When the task throws, `outcome.execution.exception` is `true`, and thrown `Error` instances are added to `outcome.execution.errors`.

```typescript
import {Runnable} from '@toreda/shared-types';

const task = new Runnable<number, number>('double', async (n) => n * 2);
const outcome = await task.run(21);

if (outcome.execution.complete) {
	console.log(outcome.returnValue); // 42
}
```

The constructor throws if `id` is not a string or `task` is not a function.

## `Defaults`
Shared default values used by Toreda packages.

```typescript
import {Defaults} from '@toreda/shared-types';

Defaults.LifecyclePhase.Status; // false
```

&nbsp;

# Object API

## `Resettable`
Interface indicating implementer provides a `reset` method.

```typescript
import type {Resettable} from '@toreda/shared-types';

class MyObj implements Resettable {
	public reset(): void {
		console.log('boop');
	}
}

const o = new MyObj();
o.reset();
```

## `Clearable`
Interface indicating implementer provides a `clear()` method. Callers expect `true` to be returned when `clear` call is successful and `false` when it was not successful, or there was nothing to clear.

```typescript
import type {Clearable} from '@toreda/shared-types';

class MyObj implements Clearable {
	public clear(): boolean {
		console.log('boop');

		return true;
	}
}

const o = new MyObj();
const result = o.clear();
```

## `Stringable`
Interface indicating implementer provides a `toString()` method which returns the object contents as a string. Typically used for serialization although usage may vary.

```typescript
import type {Stringable} from '@toreda/shared-types';

class MyObj implements Stringable {
	public a: string;
	public b: string;

	constructor() {
		this.a = 'aaaa';
		this.b = 'bbbb';
	}

	public toString(): string {
		return JSON.stringify({
			a: this.a,
			b: this.b
		});
	}
}

const o = new MyObj();
const result = o.toString();
```

## Interface reference

| Interface | Description |
| --- | --- |
| `BaseObject` | Loose object shape with a `prototype` and optional `length`. |
| `Cleanable` | Provides `clean(): boolean`. |
| `Clearable` | Provides `clear(): boolean`. |
| `Closeable<ArgT>` | Provides `close(data?: ArgT): Promise<CloseableOutcome>`. |
| `CloseableOutcome` | Result of `close()`: `closed`, optional `aborted` and `errors`. |
| `Hashable` | Provides `toHash()`. |
| `Iterable<ItemT, ReturnT, NextT>` | Provides `forEach` and `[Symbol.iterator]`. |
| `Itor<T>` | Iterator providing `next(): ItorItem<T>`. |
| `ItorItem<ItemT>` | Iterator result: `value` and `done`. |
| `LogLike` | Logger with `error`, `warn`, `info`, `debug` and `trace` methods. |
| `Records<T>` | Record list: `records` and `recordCount`. |
| `Resettable` | Provides `reset()`. |
| `RunnableOutcome<ReturnT>` | Result of `Runnable.run()`: `execution` status and `returnValue`. |
| `Serializable<DataT>` | Provides `toData(): DataT` and `serialize(): string \| null`. |
| `Storable<DataT>` | Object whose properties are primitives or `StorableObject`s. |
| `StorableObject<DataT>` | Provides `toData(): DataT` and `toString(): string`. |
| `Stringable` | Provides `toString()`. |
| `TypeMap` | Maps the names `'string'`, `'number'` and `'boolean'` to their types. |

&nbsp;

# Functional Types

Types & aliases provide shorthand to reduce code duplication and simplify statements.

## `DeepRequired<T>`
Recursively require all properties on object & children.

```typescript
import type {DeepRequired} from '@toreda/shared-types';

interface Options {
	server?: {
		port?: number;
	};
}

// server and server.port are both required.
const options: DeepRequired<Options> = {server: {port: 8080}};
```

## `Primitive`
Implementer's type is any JavaScript primitive.

```typescript
import type {Primitive} from '@toreda/shared-types';

const myValue: Primitive = null;
```

## Functional type reference

| Type | Description |
| --- | --- |
| `ANY` | Alias for `any`. Use where `any` is intentional. |
| `AnyFunc<T>` | Function taking any arguments and returning `T`. |
| `AnyObj<T>` | `Record<string, T>`. |
| `ArrayFunc<T, U>` | Array callback `(element, ndx, arr) => U`. |
| `Arrayable<T>` | `T` or `T[]`. |
| `Awaited<T>` | Unwraps the value type of a `PromiseLike<T>`. |
| `Constructor<T>` | Class constructor producing `T`. |
| `Data` | Record mapping strings to primitive data or arrays. |
| `DeepExpand<T>` | Recursively expands `T` so editors show its full shape. |
| `DeepPartial<T>` | Recursively marks all properties optional. |
| `DeepRequired<T>` | Recursively marks all properties required. |
| `Depromisify<T>` | Unwraps the value type of a `Promise<T>`. |
| `Expand<T>` | Expands the top level of `T` so editors show its full shape. |
| `Guarded<T>` | Infers the guarded type from a primitive name or constructor. |
| `ItorCallback<ItemT>` | Iterator callback `(item) => Promise<boolean>`. |
| `LiteralToPrimitive<T>` | Maps a literal type to its primitive (`'a'` to `string`). |
| `Nullable<T>` | `T \| null`. |
| `NullOrUndefined<T>` | `T \| null \| undefined`. |
| `Optional<T, K>` | Makes all properties of `T` optional except the keys in `K`. |
| `Primitive` | Any JavaScript primitive. |
| `PrimitiveOrConstructor` | A constructor, or one of the `TypeMap` names. |
| `Promisable<T>` | `T` or `Promise<T>`. |
| `RunnableTask<ArgDataT, ReturnT>` | Async task accepted by `Runnable`. |
| `RunnableTaskSync<ArgDataT, ReturnT>` | Sync task accepted by `Runnable`. |
| `StorablePrimitive` | Primitive that can be stored. |
| `StorableValue` | `Primitive` or `StorableObject`. |
| `TypeValueTest<ValueT>` | Type guard used by `typeValue`. |
| `ValidatorFn` | `(value?) => boolean`. |
| `Visitor<NodeT>` | Async node visitor `(node) => Promise<NodeT \| null>`. |

&nbsp;

# Expressive Types
Express value intent &amp; purpose with type definitions.

## `BitMask`

```typescript
import type {BitMask} from '@toreda/shared-types';

// Declare and initialize number while also expressing the value's purpose.
let mask: BitMask = 0x1;

// Becomes more clear when expecting values:
function useValue(mask: BitMask): void {
	...
}
// versus:
function useValue(mask: number): void {
	...
}
```

Expressive types make no functional difference. They tell the reader what a value means and what values are valid. For example, an ID type often restricts which characters and lengths are accepted, so it is not really an arbitrary string:

```typescript
// Expressive Type alias.
export type BigId = string;

function validateId(id: BigId): void {
	...
}
```

## Expressive type reference

All unit types are aliases of `number` unless noted.

| Category | Types |
| --- | --- |
| Length | `Femtometers`, `Picometers`, `Nanometers`, `Micrometers`, `Millimeters`, `Centimeters`, `Decimeters`, `Meters`, `Kilometers`, `Megameters`, `Gigameters`, `Terameters`, `Inches`, `Feet`, `Yards`, `Miles` |
| Mass | `Grams`, `Kilograms`, `Ounces`, `Pounds` |
| Volume | `Liters`, `Gallons`, `FluidOunces` |
| Temperature | `Celsius`, `Kelvin` |
| Angle | `Degrees`, `Radians` |
| Physics | `Farads`, `Hertz`, `Joules`, `Katals`, `Lumens`, `Newtons`, `Ohms`, `Pascals`, `Sieverts`, `Teslas`, `Volts`, `Watts`, `RSI` |
| Data size | `Bits`, `Bytes`, `Kilobits`, `Kilobytes`, `KB`, `Megabits`, `Megabytes`, `MB`, `Gigabits`, `Gigabytes`, `GB`, `Terabits`, `Terabytes`, `TB`, `Petabytes`, `Exabytes`, `FileSize` |
| Data rate | `bps`, `Bps`, `Kbps`, `KBps`, `Mbps`, `MBps`, `Gbps`, `GBps`, `Tbps`, `TBps`, `Pbps`, `PBps`. A lowercase `b` means bits per second, an uppercase `B` means bytes per second. |
| Bit flags | `BitField`, `BitMask` |
| Crypto (`string`) | `HashAlg`, `HashStr`, `Hashrate`, `PrivateKey`, `PublicKey` |
| Identifiers (`string`) | `NetworkCnxId`, `Tag` |
| Language | `LangCode`: union of locale codes such as `'en_us'` and `'fr_fr'`. |

&nbsp;

# Legal

## License
[MIT](LICENSE) &copy; Toreda, Inc.


## Copyright
Copyright &copy; 2019 - 2026 Toreda, Inc. All Rights Reserved.


## Website
Toreda's company website can be found at [toreda.com](https://www.toreda.com)
