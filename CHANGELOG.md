## [Unreleased]

### Fixed

-   Package can now be loaded at runtime from plain Node. 3.0.0 published ESM syntax with extensionless specifiers under a CommonJS `main`, so `require('@toreda/shared-types')` failed with `ERR_MODULE_NOT_FOUND` (Node 22+) or `SyntaxError: Unexpected token 'export'` (older Node).
-   Incorrect doc comments: `Kilograms` described Ohms, `MB` described Gigabytes, `Grams` was labelled Imperial, `Ohms` described capacitance instead of resistance, and `RSI` was labelled Imperial instead of SI thermal resistance. `TypeValueTest` had no doc comment, so the API docs showed the license header. Categories for `Grams`, `Kilograms` and `RSI` corrected to match.

### Changed

-   Package now ships dual builds: CommonJS in `dist/cjs` and ESM in `dist/esm`, each with a `package.json` marking its module type. Root `package.json` adds `module` and an `exports` map with `types`, `import` and `require` conditions. Deep imports into `dist/` are no longer exposed.
-   Build compiles with `tsc` (`tsconfig.cjs.json`, `tsconfig.esm.json`) instead of `esbuild`. A post-build step adds `.js` extensions to relative specifiers in the ESM `.js` and `.d.ts` output. `esbuild` and `esbuild-plugin-d.ts` removed from dev dependencies.
-   `gulpfile.ts` uses `export default` so it loads under Node's native TypeScript type stripping as well as `ts-node`.

## [3.0.0] - 2026-05-12

### Breaking Changes

-   Package renamed from `@toreda/types` to `@toreda/shared-types`. Consumers must update their imports and `package.json` dependency entries.

### Added
-   `LogLike` interface and `logLike()` structural type guard describing the minimal shape (`error`, `warn`, `info`, `debug`, `trace`) satisfied by both the global `console` and `@toreda/log`'s `Log`. Lets internals depend on a logger without coupling to any specific implementation.
-   `Hashable` interface for objects that expose a stable hash representation.
-   `Storable`, `StorableObject`, `StorablePrimitive`, and `StorableValue` types describing values compatible with Toreda storage APIs.
-   `Closeable` and `CloseableOutcome` for objects offering `.close()` with a typed result.
-   `Cleanable` for objects offering `.clean()` semantics distinct from `Clearable` / `Resettable`.
-   `Runnable` class, `RunnableOutcome`, `RunnableTask`, and `RunnableTaskSync` formalized as exports.
-   `Defaults` helper export.
-   `Tag` and `ValidatorFn` types.
-   `Visitor` and `Iterable` re-confirmed in index exports.
-   Additional unit types: `Celsius`, `Liters`, `Lumens`, `Pascals`, `Volts`, `Watts`, `RSI`, `GB`, `KB`, `MB`, `TB`, `Kbps`, `KBps`.
-   Many previously-defined types added to `src/index.ts` that were missing from the public re-exports.

### Changed

-   Package manager switched from `yarn` to `pnpm`; `yarn.lock` removed in favor of `pnpm-lock.yaml`.
-   Build pipeline now uses gulp as the orchestrator (clean → lint → compile) with `esbuild` doing the actual compile and `.d.ts` emission. The `cleanDist` step deletes `dist/**` before every build.
-   Lint inside the build is gated on the `BUILD_LINT` env var (default: on). Set `BUILD_LINT=false` to skip; `pnpm build:nolint` is a convenience wrapper that uses `cross-env` to do this cross-platform.
-   Test runner now uses `@swc/jest` with a TypeScript Jest config (`jest.config.ts`) instead of `ts-jest`.
-   GitHub Actions workflows replaced: legacy `main.yml` removed; new `ci.yml`, `prepare-release.yml`, and `release.yml` added. Release notes are now extracted directly from this changelog by `scripts/extract-changelog-section.mjs` and `scripts/prepare-changelog-release.mjs`.
-   Copyright headers updated across the source tree (`2019 - 2026 Toreda, Inc.`).
-   License year range refreshed.
-   Module specifiers normalized to relative paths to avoid VSCode auto-import resolving to absolute paths.
-   Internal `eslintrc` and `swcrc` configurations updated for the modern toolchain.
-   `marked` resolution bumped; `glob-parent` resolution added for advisory remediation.

### Removed

-   Sonar configuration (`sonar-project.properties`).
-   Dependency graph generation script and the committed graph image.
-   Crypto type tree under `src/` (see Breaking Changes above).

## [2.16.0] - 2023-02-14
-   Moved all `Lifecycle` related files into new `@toreda/lifecycle` NPM package project. `@toreda/types` is intended to include expressive types with minimal or no functions that need to be included in the final build. The lifecycle functionality is useful and needs to be expanded, thus has its own package now.

## [2.15.0] - 2022-09-04

-   Added `lifecyclePhaseOption` helper function to check phase options in lifecycle phase handlers.
-   Added `LifecyclePhaseOptions` with basic limit flags for recursive lifecycle phase handler invocation.
-   Changed `LifecycleClientDelegate` and `LifecycleServerDelegate` to extend the newly addded `LifecycleParent` interface.
-   Added `LifecycleParent` interface which makes an optional `children` property known to callers. `children` is a generic array of type `ValueT[]` whose type is defined by the caller. This property standardizes how child delegates are stored and used by `lifecyclePhase` to check for `children` during phase handling and recursively invoke their phase methods too.

## [2.14.0] - 2022-05-20

### Added

-   `LangCode` identifying localization language used in other localization systems.
-   Entity Lifecycle types: `LifecycleEntity`, `LifecycleEntityData`, `LifecycleEntityDelegate`, and `LifecycleEntityPhase`.
-   Addon Lifecycle types: `LifecycleAddon`, `LifecycleAddonData`, `LifecycleAddonDelegate`, and `LifecycleAddonPhase`.
-   `cnxWillReconnect`, `cnxDidReconnect`, `cnxWillInit`, `cnxDidInit`, `cnxWillLoad`, and `cnxDidLoad` added connection lifecycle flow.

## [2.13.1] - 2022-05-15

### Fixed

-   Erroneous 'src/' prefix in `LifecycleNetworkCnxDelegate` removed and replace with correct relative path. Could break imports before fix.

## [2.13.0] - 2022-05-12

### Added

-   `LifecycleNetworkClient`.
-   `LifecycleNetworkClientPhase` Type with phase keys for Network Clients.
-   `LifecycleNetworkClientData` to track status flags for Network Client Phases.

## [2.12.0] - 2022-05-08

### Added

-   New types for various crypto coins & tokens.

### Changed

-   Most previous ticket symbol types split into two distinct types e.g. EthAddr & EthTokenAmt (example).

## [2.11.0] - 2022-04-14

### Dependencies

-   Updated all dependencies to latest stable version available.
-   Added yarn resolution for `chokidar` to use version `^3.0.0`.

### Fixed

-   Added missing `type` qualifier to type only & interface only imports.

### Lifecycle Types

-   Added `LifecycleClientData` interface returned by the `LifecycleClient` `toData()` call. This replaces a previously generic phase name -> boolean mapping..
-   Added `LifecycleServerData` interface returned by the `LifecycleServer` `toData()` call. This replaces a previously generic phase name -> boolean mapping.

## [2.10.1] - 2022-04-12

### Fixed

-   `Iterable` incorrectly required `forEach: ArrayFunc<T, U>` which defines `forEach` as a single array function, when it should have defined `ArrayFunc` as the `fn` argument applied to each item in `forEach`.
-   `Iterable` previously required three arguments `ItemT`, `ReturnT`, and `NextT`. The third argument `NextT` now defaults to `undefined` and is considered optional.

## [2.10.0] - 2022-04-09

### Added

-   `BaseObject` interface

### Fixes & Updated

-   Added `minimist` and `marked` packages to yarn resolutions to resolve CVEs flagged by Github.
-   Updated all dev dependencies to latest.
-   Performed `yarn upgrade`.

## [2.9.1] - 2022-04-06

### New Types

-   `Runnable<ArgT, ReturnT>` interface for classes which implement a runnable task interface.
-   `RunnableTask<ArgT, ReturnT>` type signature for asynchronous functions invoked by `Runnable` classes.
-   `RunnableTaskSync<ArgT, ReturnT>` type signature for synchronous functions invoked by `Runnable` classes. Prefer async tasks whenever possible.

## [2.8.0] - 2022-02-22

### New Types

### Cryptocurrency Units

-   `AAVE`
-   `ADA`
-   `ALGO`
-   `APE`
-   `ATOM`
-   `AVAX`
-   `AXS`
-   `BCH`
-   `BCN`
-   `BNB`
-   `BTC`
-   `BTM`
-   `BTM`
-   `BTT`
-   `BTT`
-   `BUSD`
-   `CAKE`
-   `CDAI`
-   `CEL`
-   `CELO`
-   `Coins`
-   `CUSDC`
-   `DAI`
-   `DASH`
-   `DGB`
-   `DOGE`
-   `DOT`
-   `ENJ`
-   `EOS`
-   `ETH`
-   `FIL`
-   `FLO`
-   `FLOW`
-   `FTM`
-   `FTX`
-   `FTX`
-   `GALA`
-   `GRT`
-   `Hashrate`
-   `HBAR`
-   `KCS`
-   `KSM`
-   `LINK`
-   `LRC`
-   `LTC`
-   `LUNA`
-   `MANA`
-   `MATIC`
-   `MKR`
-   `NEAR`
-   `NEXO`
-   `RVN`
-   `SAND`
-   `SHIB`
-   `SOL`
-   `STX`
-   `SYS`
-   `Tokens`
-   `TRX`
-   `TUSD`
-   `UNI`
-   `USDC`
-   `USDT`
-   `VET`
-   `VTC`
-   `WAVES`
-   `WBTC`
-   `WETH`
-   `ZEC`
-   `XLM`
-   `XMR`
-   `XRD`
-   `XRP`
-   `XTZ`
-   `XVG`
-   `ZEN`
-   `ZIL`
-   `ICP`

### Scientific Units

-   `Amperes`
-   `Degrees`
-   `Katals`
-   `Farads`
-   `Hertz`
-   `Joules`
-   `Kelvin`
-   `Kilograms`
-   `Mole`
-   `Newtons`
-   `Ohms`
-   `Radians`
-   `Sieverts`
-   `Telsas`

### Data Units

-   `Bits`
-   `Bytes`
-   `Kilobytes`
-   `Kilobits`
-   `Megabytes`
-   `Gigabytes`
-   `Petabytes`
-   `Megabits`
-   `Gigabits`
-   `Exabytes`
-   `Terabytes`
-   `Terabits`

### Data-rate Units

-   `bps`
-   `Bps`
-   `Mbps`
-   `MBps`
-   `Gbps`
-   `GBps`
-   `Tbps`
-   `TBps`
-   `Pbps`
-   `PBps`

### Size and Distance

#### Imperial

-   `Feet`
-   `FluidOunces`
-   `Gallons`
-   `Grams`
-   `Inches`
-   `Miles`
-   `Ounces`
-   `Pounds`
-   `Yards`

#### Metric

-   `Centimeters`
-   `Decimeters`
-   `Femtometers`
-   `Gigameters`
-   `Kilometers`
-   `Megameters`
-   `Meters`
-   `Micrometers`
-   `Micrometers`
-   `Millimeters`
-   `Nanometers`
-   `Picometers`
-   `Terameters`

-   `HashStr` to express hash string values.
-   `HashAlg` to express unique identifiers for hashing algorithms, e.g. `sha256`. Does not comfort to a specific format e.g. `sha256` vs `sha-256`, only that the stored value uniquely identifies a hashing algorithm.
-   `FileSize` to express file sizes in bytes or other units.
-   `PublicKey` to identify properties containing public key data, but does not describe algorithm, length, or other specific properties about the key.
-   `PrivateKey` to identify properties containing private key data, but does not describe algorithm, length, or other specific properties about the key.

## [2.7.0] - 2022-02-21

### Added

-   `Serializable` for classes which need both `serialize()` and `toData()` function support.

&nbsp;

## [2.6.0] - 2022-01-02

### Added

-   `LifecycleServerDelegate` for server-side classes using lifecycles.
-   `LifecycleClientDelegate` for client-side classes using lifecycles.
-   `LifecyclePhaseId` as an expressive type to clarify the purpose of some name & id args used in lifecycle functions.
-   `Itor` for Iterators which contain a next call.
-   `ItorItem` for values returned by `Itor.next()`.
-   `Clearable` for objects offering `.clear()` functionality.
-   `Resettable` for objects offering state reset via `.reset()`.
-   `Visitor<NodeT>` for Visitor functions used in Graph and Tree search algorithms. Returns `Promise<NodeT | null>`, allowing the function to return the next node or indicate there are no more nodes.
-   `ArrayFunc<T, U>` used by `.forEach(...)` calls on Iterable objects.

&nbsp;

## [2.5.0] - 2021-11-18

### Added

-   `IdFn` type that defines expected id properties as a string, helper function, or `Strong` type.
-   `Cacheable` interface defining required properties for objects to be compatible with Toreda Cache classes.

&nbsp;

## [2.4.1] - 2021-11-08

### Added

-   `Optional<T, K>` generic type which takes an interface `T` to make all properties optional except for one or more keys provided for `k`. For example: `Optional<MyInterface, 'one' | 'two'>` makes all properties on interface `MyInterface` optional except for keys which exactly match `one` or `two`.

### Removed

-   `gulp-eslint` package dependency.

&nbsp;

## [2.4.0]

-   No changelog for release.

&nbsp;

## [2.0.0] - 2021-09-27

### Changed

-   `CanBeNullOrUndefined` is now `NullOrUndefined` and moved from `./src/aliases.ts` to `./src/null/or/undefined.ts`.
-   `GuardedType` is now `Guarded` and moved from `./src/aliases.ts` to `./src/guarded.ts`.

### Moved

-   `ANY` from `./src/aliases.ts` to `./src/any.ts`.
-   `AnyObj<T = unknown>` from `./src/any/obj.ts` to `./src/any/obj.ts`.
-   `AnyFunc<T = unkown>` from `./src/aliases.ts` to `./src/any/func.ts`.
-   `Arrayable<T = unknown>` from `./src/aliases.ts` to `./src/arrayable.ts`.
-   `Awaited<T = unknown>` from `./src/aliases.ts` to `./src/awaited.ts`.
-   `Constructor<T = unknown>` from `./src/aliases.ts` to `./src/constructor.ts`
-   `DeepExpand<T>` from `./src/aliases.ts` to `./src/deep/expand.ts`..
-   `DeepPartial<T>` from `./src/aliases.ts` to `./src/deep/partial.ts`.
-   `DeepRequired<T>` from `./src/aliases.ts` to `./src/deep/required.ts`.
-   `LiteralToPrimitive<SubOption>` from `./src/aliases.ts` to `./src/literal/to/primitive.ts`.
-   `Nullable<T = unknown>` from `./src/aliases.ts` to `./src/nullable.ts`.
-   `PrimitiveOrConstructor` from `./src/aliases.ts` to `./src/primitive/or/constructor.ts`.
-   `Promisable<T = unknown>` from `./src/aliases.ts` to `./src/promisable.ts`.
-   `Stringable<T = unknown>` from `./src/aliases.ts` to `./src/stringable.ts`.

&nbsp;

## [1.2.2]

-   No changelog for release.

[Unreleased]: https://github.com/toreda/shared-types/compare/v3.0.0...HEAD
[3.0.0]: https://github.com/toreda/shared-types/releases/tag/v3.0.0
[2.16.0]: https://www.npmjs.com/package/@toreda/types/v/2.16.0
[2.15.0]: https://www.npmjs.com/package/@toreda/types/v/2.15.0
[2.14.0]: https://github.com/toreda/shared-types/compare/v2.13.1...v2.14.0
[2.13.1]: https://github.com/toreda/shared-types/releases/tag/v2.13.1
[2.13.0]: https://www.npmjs.com/package/@toreda/types/v/2.13.0
[2.12.0]: https://www.npmjs.com/package/@toreda/types/v/2.12.0
[2.11.0]: https://www.npmjs.com/package/@toreda/types/v/2.11.0
[2.10.1]: https://github.com/toreda/shared-types/compare/v2.10.0...v2.10.1
[2.10.0]: https://github.com/toreda/shared-types/compare/v.2.9.1...v2.10.0
[2.9.1]: https://github.com/toreda/shared-types/compare/v2.8.0...v.2.9.1
[2.8.0]: https://github.com/toreda/shared-types/compare/v2.7.0...v2.8.0
[2.7.0]: https://github.com/toreda/shared-types/compare/v2.6.0...v2.7.0
[2.6.0]: https://github.com/toreda/shared-types/releases/tag/v2.6.0
[2.5.0]: https://www.npmjs.com/package/@toreda/types/v/2.5.0
[2.4.1]: https://github.com/toreda/shared-types/releases/tag/v2.4.1
[2.4.0]: https://www.npmjs.com/package/@toreda/types/v/2.4.0
[2.0.0]: https://www.npmjs.com/package/@toreda/types/v/2.0.0
[1.2.2]: https://github.com/toreda/shared-types/releases/tag/v1.2.2
