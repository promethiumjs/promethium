# TODO

- Remove `effect`, `signal` and `computed` in favour of `adaptX` functions
- Restructure and heavily comment tests/specs (with `adaptX` family)
- Restructure and heavily comment signals implementation as needed
- Implement `adaptDeepState`, `adaptProxyObjectState`, `adaptProxyArrayState`
- Implement `AdaptedMemo` and so on to depend on their respective classes
and so on (function names subject to change)
- Implement support for `toJSON`, `valueOf`, and so on for signals and computeds
- Implement serialization and deserialization methods for signals and others
- Update `create-promethium`
- Extend `Effect`, `Computed` and `Signal` to block access to certain
properties and allow others to be accessed
- Expose `.value` again (turns out it's really useful for typescript
type-narrowing in branches and stuff)
