---
title:  Regex syntax - Azure Data Explorer
description: This article lists the regular expression syntax accepted by Kusto Query Language (KQL).
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/03/2023
---

# Regex syntax

This article provides an overview of regular expression syntax supported by [Kusto Query Language (KQL)](index.md).

There are a number of KQL operators and functions that perform string matching, selection, and extraction with regular expressions, such as [`matches regex`](matches-regex-operator.md), [`parse`](parse-operator.md), and [`replace_regex()`](replace-regex-function.md).

In KQL, regular expressions must be encoded as [string literals](scalar-data-types/string.md) and follow the string quoting rules. For example, the regular expression `\A` is represented in KQL as `"\\A"`. The extra backslash indicates that the other backslash is part of the regular expression `\A`.

## Syntax

The following section documents the syntax supported by the Regex engine used in Kusto.

### Matching one character

| Pattern       | Description                                                        |
|---------------|--------------------------------------------------------------------|
| `.`           |  any character except new line (includes new line with s flag)     |
| `[0-9]`       |  any ASCII digit                                                   |
| `\d`          |  digit (`\p{Nd}`)                                                  |
| `\D`          |  not digit                                                         |
| `\pX`         |  Unicode character class identified by a one-letter name           |
| `\p{Greek}`   |  Unicode character class (general category or script)              |
| `\PX`         |  Negated Unicode character class identified by a one-letter name   |
| `\P{Greek}`   |  negated Unicode character class (general category or script)      |

### Character classes

| Pattern       | Description                                                              |
|---------------|--------------------------------------------------------------------------|
| `[xyz]`       |  A character class matching either x, y or z (union).                    |
| `[^xyz]`      |  A character class matching any character except x, y and z.             |
| `[a-z]`       |  A character class matching any character in range a-z.                  |
| `[[:alpha:]]` |  ASCII character class ([A-Za-z])                                        |
| `[[:^alpha:]]`|  Negated ASCII character class ([^A-Za-z])                               |
| `[x[^xyz]]`   |  Nested/grouping character class (matching any character except y and z) |
| `[a-y&&xyz]`  |  Intersection (matching x or y)                                          |
| `[0-9&&[^4]]` |  Subtraction using intersection and negation (matching 0-9 except 4)     |
| `[0-9--4]`    |  Direct subtraction (matching 0-9 except 4)                              |
| `[a-g~~b-h]`  |  Symmetric difference (matching `a` and `h` only)                        |
| `[\[\]]`      |  Escaping in character classes (matching [ or ])                         |
| `[a&&b]`      |  An empty character class matching nothing                               |

> [!NOTE]
> Any named character class may appear inside a bracketed `[...]` character class. For example, `[\p{Greek}[:digit:]]` matches any ASCII digit or any codepoint in the `Greek` script. `[\p{Greek}&&\pL]` matches Greek letters.

Precedence in character classes, from most binding to least:

1. Ranges: `[a-cd]` == `[[a-c]d]`
2. Union: `[ab&&bc]` == `[[ab]&&[bc]]`
3. Intersection, difference, symmetric difference. All three have equivalent
precedence, and are evaluated in left-to-right order. For example,
`[\pL--\p{Greek}&&\p{Uppercase}]` == `[[\pL--\p{Greek}]&&\p{Uppercase}]`.
4. Negation: `[^a-z&&b]` == `[^[a-z&&b]]`.

### Composites

| Pattern |  Description                          |
|---------|---------------------------------------|
| `xy`    | concatenation (`x` followed by `y`)   |
| `x\|y`  | alternation (`x` or `y` , prefer `x`) |

### Repetitions

| Pattern   |  Description                                  |
|-----------|-----------------------------------------------|
| `x*`      |  zero or more of x (greedy)                   |
| `x+`      |  one or more of x (greedy)                    |
| `x?`      |  zero or one of x (greedy)                    |
| `x*?`     |  zero or more of x (ungreedy/lazy)            |
| `x+?`     |  one or more of x (ungreedy/lazy)             |
| `x??`     |  zero or one of x (ungreedy/lazy)             |
| `x{n,m}`  |  at least n x and at most m x (greedy)        |
| `x{n,}`   |  at least n x (greedy)                        |
| `x{n}`    |  exactly n x                                  |
| `x{n,m}?` |  at least n x and at most m x (ungreedy/lazy) |
| `x{n,}?`  |  at least n x (ungreedy/lazy)                 |
| `x{n}?`   |  exactly n x

### Empty matches

| Pattern          |   Description                                                               |
|------------------|-----------------------------------------------------------------------------|
| `^`              | the beginning of a haystack (or start-of-line with multi-line mode)         |
| `$`              | the end of a haystack (or end-of-line with multi-line mode)                 |
| `\A`             | only the beginning of a haystack (even with multi-line mode enabled)        |
| `\z`             | only the end of a haystack (even with multi-line mode enabled)              |
| `\b`             | a Unicode word boundary (`\w` on one side and `\W`, `\A`, or `\z` on other) |
| `\B`             | not a Unicode word boundary                                                 |
| `\b{start}`, `\<`| a Unicode start-of-word boundary (`\W\|\A` on the left, `\w` on the right) |
| `\b{end}`, `\>`  | a Unicode end-of-word boundary (`\w` on the left, `\W\|\z` on the right)   |
| `\b{start-half}` | half of a Unicode start-of-word boundary (`\W\|\A` on the left)              |
| `\b{end-half}`   | half of a Unicode end-of-word boundary (`\W\|\z` on the right)               |

### Grouping and flags

| Pattern          |   Description                                                       |
|------------------|---------------------------------------------------------------------|
| `(exp)`          | numbered capture group (indexed by opening parenthesis)             |
| `(?P<name>exp)`  | named (also numbered) capture group (names must be alpha-numeric)   |
| `(?<name>exp)`   | named (also numbered) capture group (names must be alpha-numeric)   |
| `(?:exp)`        | non-capturing group                                                 |
| `(?flags)`       | set flags within current group                                      |
| `(?flags:exp)`   | set flags for exp (non-capturing)                                   |

Capture group names must be any sequence of alpha-numeric Unicode codepoints,
in addition to `.`, `_`, `[` and `]`. Names must start with either an `_` or
an alphabetic codepoint. Alphabetic codepoints correspond to the `Alphabetic`
Unicode property, while numeric codepoints correspond to the union of the
`Decimal_Number`, `Letter_Number` and `Other_Number` general categories.

Flags are each a single character. For example, `(?x)` sets the flag `x`
and `(?-x)` clears the flag `x`. Multiple flags can be set or cleared at
the same time: `(?xy)` sets both the `x` and `y` flags and `(?x-y)` sets
the `x` flag and clears the `y` flag.

All flags are by default disabled unless stated otherwise. They are:

<a name="flags"></a>

| Flag    | Description                                                                   |
|---------|-------------------------------------------------------------------------------|
| `i`     | case-insensitive: letters match both upper and lower case                     |
| `m`     | multi-line mode: `^` and `$` match begin/end of line                          |
| `s`     | allow . to match `\n`                                                         |
| `R`     | enables CRLF mode: when multi-line mode is enabled, `\r\n` is used            |
| `U`     | swap the meaning of `x*` and `x*?`                                            |
| `u`     | Unicode support (enabled by default)                                          |
| `x`     | verbose mode, ignores whitespace and allow line comments (starting with `#`)  |

Note that in verbose mode, whitespace is ignored everywhere, including within
character classes. To insert whitespace, use its escaped form or a hex literal.
For example, `\ ` or `\x20` for an ASCII space.

> [!NOTE]
> * Flags can be toggled within a pattern. Here's an example that matches case-insensitively for the first part but case-sensitively for the second part: `(?i)a+(?-i)b+`.
> * The `a+` matches either `a` or `A`, but the `b+` only matches `b`.
> * Multi-line mode means `^` and `$` no longer match just at the beginning/end of the input, but also at the beginning/end of lines. Note that `^` matches after new lines, even at the end of input.
> * When both CRLF mode and multi-line mode are enabled, then `^` and `$` will match either `\r` and `\n`, but never in the middle of a `\r\n`.
> * Unicode mode can also be selectively disabled, although only when the result *would not* match invalid UTF-8. One good example of this is using an ASCII word boundary instead of a Unicode word boundary, which might make some regex searches run faster: `(?-u:\b).+(?-u:\b)` to match `$$abc$$`.

### Escape sequences

| Pattern            | Description                                                      |
|--------------------|------------------------------------------------------------------|
| `\*`               | literal `*`, applies to all ASCII except `[0-9A-Za-z<>]`         |
| `\a`               | bell (`\x07`)                                                    |
| `\f`               | form feed (`\x0C`)                                               |
| `\t`               | horizontal tab                                                   |
| `\n`               | new line                                                         |
| `\r`               | carriage return                                                  |
| `\v`               | vertical tab (`\x0B`)                                            |
| `\A`               | matches at the beginning of a haystack                           |
| `\z`               | matches at the end of a haystack                                 |
| `\b`               | word boundary assertion                                          |
| `\B`               | negated word boundary assertion                                  |
| `\b{start}`, `\<`  | start-of-word boundary assertion                                 |
| `\b{end}`, `\>`    | end-of-word boundary assertion                                   |
| `\b{start-half}`   | half of a start-of-word boundary assertion                       |
| `\b{end-half}`     | half of an end-of-word boundary assertion                         |
| `\123`             | octal character code, up to three digits                         |
| `\x7F`             | hex character code (exactly two digits)                          |
| `\x{10FFFF}`       | any hex character code corresponding to a Unicode code point     |
| `\u007F`           | hex character code (exactly four digits)                         |
| `\u{7F}`           | any hex character code corresponding to a Unicode code point     |
| `\U0000007F`       | hex character code (exactly eight digits)                        |
| `\U{7F}`           | any hex character code corresponding to a Unicode code point     |
| `\p{Letter}`       | Unicode character class                                          |
| `\P{Letter}`       | negated Unicode character class                                  |
| `\d`, `\s`, `\w`   | Perl character class                                             |
| `\D`, `\S`, `\W`   | negated Perl character class                                     |

### Perl character classes (Unicode friendly)

These classes are based on the definitions provided in
[UTS#18](https://www.unicode.org/reports/tr18/#Compatibility_Properties):

| Pattern  | Description                                                      |
|----------|------------------------------------------------------------------|
| `\d`     | digit (`\p{Nd}`)                                                 |
| `\D`     | not digit                                                        |
| `\s`     | whitespace (`\p{White_Space}`)                                   |
| `\S`     | not whitespace                                                   |
| `\w`     | word character (`\p{Alphabetic}` + `\p{M}` + `\d` + `\p{Pc}` + `\p{Join_Control}`) |
| `\W`     | not word character                                               |

### ASCII character classes

These classes are based on the definitions provided in
[UTS#18](https://www.unicode.org/reports/tr18/#Compatibility_Properties):

| Pattern        | Description                          |
|----------------|--------------------------------------|
| `[[:alnum:]]`  |  alphanumeric (`[0-9A-Za-z]`)        |
| `[[:alpha:]]`  |  alphabetic (`[A-Za-z]`)             |
| `[[:ascii:]]`  |  ASCII (`[\x00-\x7F]`)               |
| `[[:blank:]]`  |  blank (`[\t ]`)                     |
| `[[:cntrl:]]`  |  control (`[\x00-\x1F\x7F]`)         |
| `[[:digit:]]`  |  digits (`[0-9]`)                    |
| `[[:graph:]]`  |  graphical (`[!-~]`)                 |
| `[[:lower:]]`  |  lower case (`[a-z]`)                |
| `[[:print:]]`  |  printable (`[ -~]`)                 |
| `[[:punct:]]`  |  punctuation (``[!-/:-@\[-`{-~]``)   |
| `[[:space:]]`  |  whitespace (`[\t\n\v\f\r ]`)        |
| `[[:upper:]]`  |  upper case (`[A-Z]`)                |
| `[[:word:]]`   |  word characters (`[0-9A-Za-z_]`)    |
| `[[:xdigit:]]` |  hex digit (`[0-9A-Fa-f]`)           |


## Performance

This section briefly discusses a few concerns regarding the speed and resource usage of regexes.

### Unicode can impact memory usage and search speed

Kusto regex engine provides first class support for Unicode. In many cases, the extra memory required to support it will be negligible and it typically won't impact search speed. But it can in some cases.

With respect to memory usage, the impact of Unicode principally manifests through the use of Unicode character classes. Unicode character classes tend to be quite large. For example, `\w` by default matches around 140,000 distinct codepoints. This requires additional memory, and tends to slow down regex compilation. While a `\w` here and there is unlikely to be noticed, writing `\w{100}` will for example result in quite a large regex by default. Indeed, `\w` is considerably larger than its ASCII-only version, so if your requirements are satisfied by ASCII, it's probably a good idea to stick to ASCII classes. The ASCII-only version of `\w` can be spelled in a number of ways. All of the following are equivalent:

```
[0-9A-Za-z_]
(?-u:\w)
[[:word:]]
[\w&&\p{ascii}]
```

With respect to search speed, Unicode tends to be handled pretty well, even when using large Unicode character classes. However, some of the faster internal regex engines cannot handle a Unicode aware word boundary assertion. So if you don’t need Unicode-aware word boundary assertions, you might consider using `(?-u:\b)` instead of `\b`, where the former uses an ASCII-only definition of a word character.

### Literals might accelerate searches

Kusto regex engine tends to be quite good at recognizing literals in a regex pattern and using them to accelerate a search. If it is at all possible to include some kind of literal in your pattern, then it might make search substantially faster. For example, in the regex `\w+@\w+`, the engine will look for occurrences of `@` and then try a reverse match for `\w+` to find the start position.
