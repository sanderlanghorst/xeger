# Regex cheatsheet
[info](https://www.regular-expressions.info)

## main selectors
- [x] `.` alles behalve newline
- [x] `[abc]` lijst van karakters
- [x] `[a-z]` bereik van karakters
- [x] `[^a-z]` alles behalve bereik van karakters
- [x] `|` of
- [x] `?` 0 of 1 keer
- [x] `*` 0 of meer
- [x] `+` 1 of meer
- [x] `?? *? +? {n}? {n,m}?` lazy
- [x] `()` groep
- [x] `{n}` n keer
- [x] `{n,}` minstens n keer
- [x] `{n,m}` n tot m keer
- [x] `\` escaped character

## special characters:
### Shorthands
- [x] `\d` `[0-9]` digit
- [x] `\D` `[^\d]` alles behalve digit
- [x] `\w` `[A-Za-z0-9_]` woord
- [x] `\W` `[^\w]` alles behalve woord
- [x] `\s` `[ \t\r\n\f]` whitespace
- [x] `\S` `[^\s]` alles behalve whitespace

### Non-printable
- [x] `\t` tab
- [x] `\r` carier return
- [x] `\n` newline
- [x] `\f` form feed
- [ ] `\cA-Z` ASCII control characters
- [ ] `\x01-FF` ASCII characters
- [ ] `\x{FFFF}` unicode character
- [ ] `\uFFFF` unicode character

### Looking around (not captured)
- [ ] `^` begin
- [ ] `$` eind
- [ ] `\b` woord boundary (zero length)
- [ ] `\B` alles behalve woord boundary (zero length)
- [x] `(?:)` non-capturing
- [ ] `(?=)` positive lookahead
- [ ] `(?!)` negative lookahead
- [ ] `(?<=)` positive lookbehind
- [ ] `(?<!)` negative lookbehind

### Backreference
- [ ] `\1-99` backreference

## not supported
- `(?P<n>)` named groups
- `(?P=n)` referencing named groups

## Maintenance
- [ ] Permutate not further then output size