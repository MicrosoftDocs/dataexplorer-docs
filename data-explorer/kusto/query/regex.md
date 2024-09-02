---
title:   Regex syntax
description: Learn about the regular expression syntax supported by Kusto Query Language (KQL).
ms.reviewer: alexans
ms.topic: reference
ms.date: 09/01/2024
---
# Regex syntax

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

This article provides an overview of regular expression syntax supported by [Kusto Query Language (KQL)](index.md).

There are a number of KQL operators and functions that perform string matching, selection, and extraction with regular expressions, such as [`matches regex`](matches-regex-operator.md), [`parse`](parse-operator.md), and [`replace_regex()`](replace-regex-function.md).

In KQL, regular expressions must be encoded as [string literals](scalar-data-types/string.md) and follow the string quoting rules. For example, the regular expression `\A` is represented in KQL as `"\\A"`. The extra backslash indicates that the other backslash is part of the regular expression `\A`.

## Syntax

The following sections document the regular expression syntax supported by Kusto.

### Match one character

| Pattern     | Description                                                     |
|-------------|-----------------------------------------------------------------|
| `.`         | Any character except new line (includes new line with s flag)   |
| `[0-9]`     | Any ASCII digit                                                 |
| `\d`        | Digit (`\p{Nd}`)                                                |
| `\D`        | Not a digit                                                     |
| `\pX`       | Unicode character class identified by a one-letter name         |
| `\p{Greek}` | Unicode character class (general category or script)            |
| `\PX`       | Negated Unicode character class identified by a one-letter name |
| `\P{Greek}` | Negated Unicode character class (general category or script)    |

### Character classes

| Pattern        | Description                                                             |
|----------------|-------------------------------------------------------------------------|
| `[xyz]`        | Character class matching either x, y or z (union).                      |
| `[^xyz]`       | Character class matching any character except x, y and z.               |
| `[a-z]`        | Character class matching any character in range a-z.                    |
| `[[:alpha:]]`  | ASCII character class ([A-Za-z])                                        |
| `[[:^alpha:]]` | Negated ASCII character class ([^A-Za-z])                               |
| `[x[^xyz]]`    | Nested/grouping character class (matching any character except y and z) |
| `[a-y&&xyz]`   | Intersection (matching x or y)                                          |
| `[0-9&&[^4]]`  | Subtraction using intersection and negation (matching 0-9 except 4)     |
| `[0-9--4]`     | Direct subtraction (matching 0-9 except 4)                              |
| `[a-g~~b-h]`   | Symmetric difference (matching `a` and `h` only)                        |
| `[\[\]]`       | Escape in character classes (matching [ or ])                           |
| `[a&&b]`       | Empty character class matching nothing                                  |

> [!NOTE]
> Any named character class may appear inside a bracketed `[...]` character class. For example, `[\p{Greek}[:digit:]]` matches any ASCII digit or any codepoint in the `Greek` script. `[\p{Greek}&&\pL]` matches Greek letters.

Precedence in character classes is from most binding to least binding:

1. Ranges: `[a-cd]` == `[[a-c]d]`
2. Union: `[ab&&bc]` == `[[ab]&&[bc]]`
3. Intersection, difference, symmetric difference: All have equivalent precedence, and are evaluated from left-to-right. For example, `[\pL--\p{Greek}&&\p{Uppercase}]` == `[[\pL--\p{Greek}]&&\p{Uppercase}]`.
4. Negation: `[^a-z&&b]` == `[^[a-z&&b]]`.

### Composites

| Pattern |  Description                          |
|---------|---------------------------------------|
| `xy`    | Concatenation (`x` followed by `y`)   |
| `x\|y`  | Alternation (`x` or `y` , prefer `x`) |

### Repetitions

| Pattern   | Description                                  |
|-----------|----------------------------------------------|
| `x*`      | Zero or more of x (greedy)                   |
| `x+`      | One or more of x (greedy)                    |
| `x?`      | Zero or one of x (greedy)                    |
| `x*?`     | Zero or more of x (ungreedy/lazy)            |
| `x+?`     | One or more of x (ungreedy/lazy)             |
| `x??`     | Zero or one of x (ungreedy/lazy)             |
| `x{n,m}`  | At least n x and at most m x (greedy)        |
| `x{n,}`   | At least n x (greedy)                        |
| `x{n}`    | Exactly n x                                  |
| `x{n,m}?` | At least n x and at most m x (ungreedy/lazy) |
| `x{n,}?`  | At least n x (ungreedy/lazy)                 |
| `x{n}?`   | Exactly n x                                  |

### Empty matches

| Pattern           | Description                                                               |
|------------------ |---------------------------------------------------------------------------|
| `^`               | Beginning of a haystack (or start-of-line with multi-line mode)           |
| `$`               | End of a haystack (or end-of-line with multi-line mode)                   |
| `\A`              | Only the beginning of a haystack (even with multi-line mode enabled)      |
| `\z`              | Only the end of a haystack (even with multi-line mode enabled)            |
| `\b`              | Unicode word boundary (`\w` on one side and `\W`, `\A`, or `\z` on other) |
| `\B`              | Not a Unicode word boundary                                               |
| `\b{start}`, `\<` | Unicode start-of-word boundary (`\W\|\A` on the left, `\w` on the right)  |
| `\b{end}`, `\>`   | Unicode end-of-word boundary (`\w` on the left, `\W\|\z` on the right)    |
| `\b{start-half}`  | Half of a Unicode start-of-word boundary (`\W\|\A` on the left)           |
| `\b{end-half}`    | Half of a Unicode end-of-word boundary (`\W\|\z` on the right)            |

### Grouping and flags

| Pattern          | Description                                                       |
|------------------|-------------------------------------------------------------------|
| `(exp)`          | Numbered capture group (indexed by opening parenthesis)           |
| `(?P<name>exp)`  | Named (also numbered) capture group (names must be alpha-numeric) |
| `(?<name>exp)`   | Named (also numbered) capture group (names must be alpha-numeric) |
| `(?:exp)`        | Non-capturing group                                               |
| `(?flags)`       | Set flags within current group                                    |
| `(?flags:exp)`   | Set flags for exp (non-capturing)                                 |

Capture group names can contain only alpha-numeric Unicode codepoints, dots `.`, underscores `_`, and square brackets`[` and `]`. Names must start with either an `_` or an alphabetic codepoint. Alphabetic codepoints correspond to the `Alphabetic` Unicode property, while numeric codepoints correspond to the union of the `Decimal_Number`, `Letter_Number` and `Other_Number` general categories.

Flags are single characters. For example, `(?x)` sets the flag `x` and `(?-x)` clears the flag `x`. Multiple flags can be set or cleared at the same time: `(?xy)` sets both the `x` and `y` flags and `(?x-y)` sets the `x` flag and clears the `y` flag. By default all flags are disabled unless stated otherwise. They are:

<a name="flags"></a>

| Flag    | Description                                                                   |
|---------|-------------------------------------------------------------------------------|
| `i`     | Case-insensitive: letters match both upper and lower case                     |
| `m`     | Multi-line mode: `^` and `$` match begin/end of line                          |
| `s`     | Allow dot (.). to match `\n`                                                  |
| `R`     | Enables CRLF mode: when multi-line mode is enabled, `\r\n` is used            |
| `U`     | Swap the meaning of `x*` and `x*?`                                            |
| `u`     | Unicode support (enabled by default)                                          |
| `x`     | Verbose mode, ignores whitespace and allow line comments (starting with `#`)  |

Note that in verbose mode, whitespace is ignored everywhere, including within character classes. To insert whitespace, use its escaped form or a hex literal. For example, `\ ` or `\x20` for an ASCII space.

> [!NOTE]
>
> * Flags can be toggled within a pattern. For example, the following syntax uses a case-insensitive match for the first part and a case-sensitive match for the second part: `(?i)a+(?-i)b+`.
> * `a+` matches either `a` or `A`, but the `b+` only matches `b`.
> * Multi-line mode means `^` and `$` no longer match just at the beginning or end of the input, but also at the beginning or end of lines. Note that `^` matches after new lines, even at the end of input.
> * When both CRLF mode and multi-line mode are enabled, then `^` and `$` match either `\r` and `\n`, but never in the middle of a `\r\n`.
> * Unicode mode can also be selectively disabled, although only when the result *would not* match invalid UTF-8. For example, using an ASCII word boundary instead of a Unicode word boundary might make some regex searches run faster: `(?-u:\b).+(?-u:\b)` to match `$$abc$$`.

### Escape sequences

| Pattern           | Description                                                  |
|-------------------|--------------------------------------------------------------|
| `\*`              | Literal `*`, applies to all ASCII except `[0-9A-Za-z<>]`     |
| `\a`              | Bell (`\x07`)                                                |
| `\f`              | Form feed (`\x0C`)                                           |
| `\t`              | Horizontal tab                                               |
| `\n`              | New line                                                     |
| `\r`              | Carriage return                                              |
| `\v`              | Vertical tab (`\x0B`)                                        |
| `\A`              | Matches at the beginning of a haystack                       |
| `\z`              | Matches at the end of a haystack                             |
| `\b`              | Word boundary assertion                                      |
| `\B`              | Negated word boundary assertion                              |
| `\b{start}`, `\<` | Start-of-word boundary assertion                             |
| `\b{end}`, `\>`   | End-of-word boundary assertion                               |
| `\b{start-half}`  | Half of a start-of-word boundary assertion                   |
| `\b{end-half}`    | Half of an end-of-word boundary assertion                    |
| `\123`            | Octal character code, up to three digits                     |
| `\x7F`            | Hex character code (exactly two digits)                      |
| `\x{10FFFF}`      | Hex character code corresponding to a Unicode code point     |
| `\u007F`          | Hex character code (exactly four digits)                     |
| `\u{7F}`          | Hex character code corresponding to a Unicode code point     |
| `\U0000007F`      | Hex character code (exactly eight digits)                    |
| `\U{7F}`          | Hex character code corresponding to a Unicode code point     |
| `\p{Letter}`      | Unicode character class                                      |
| `\P{Letter}`      | Negated Unicode character class                              |
| `\d`, `\s`, `\w`  | Perl character class                                         |
| `\D`, `\S`, `\W`  | Negated Perl character class                                 |

### Perl character classes (Unicode friendly)

These classes are based on the definitions provided in [UTS#18](https://www.unicode.org/reports/tr18/#Compatibility_Properties):

| Pattern | Description                                                                        |
|---------|------------------------------------------------------------------------------------|
| `\d`    | Ddigit (`\p{Nd}`)                                                                  |
| `\D`    | Not digit                                                                          |
| `\s`    | Whitespace (`\p{White_Space}`)                                                     |
| `\S`    | Not whitespace                                                                     |
| `\w`    | Word character (`\p{Alphabetic}` + `\p{M}` + `\d` + `\p{Pc}` + `\p{Join_Control}`) |
| `\W`    | Not word character                                                                 |

### ASCII character classes

These classes are based on the definitions provided in [UTS#18](https://www.unicode.org/reports/tr18/#Compatibility_Properties):

| Pattern        | Description                          |
|----------------|--------------------------------------|
| `[[:alnum:]]`  |  Alphanumeric (`[0-9A-Za-z]`)        |
| `[[:alpha:]]`  |  Alphabetic (`[A-Za-z]`)             |
| `[[:ascii:]]`  |  ASCII (`[\x00-\x7F]`)               |
| `[[:blank:]]`  |  Blank (`[\t ]`)                     |
| `[[:cntrl:]]`  |  Control (`[\x00-\x1F\x7F]`)         |
| `[[:digit:]]`  |  Digits (`[0-9]`)                    |
| `[[:graph:]]`  |  Graphical (`[!-~]`)                 |
| `[[:lower:]]`  |  Lower case (`[a-z]`)                |
| `[[:print:]]`  |  Printable (`[ -~]`)                 |
| `[[:punct:]]`  |  Punctuation (``[!-/:-@\[-`{-~]``)   |
| `[[:space:]]`  |  Whitespace (`[\t\n\v\f\r ]`)        |
| `[[:upper:]]`  |  Upper case (`[A-Z]`)                |
| `[[:word:]]`   |  Word characters (`[0-9A-Za-z_]`)    |
| `[[:xdigit:]]` |  Hex digit (`[0-9A-Fa-f]`)           |

## Performance

This section provides some guidance on speed and resource usage of regex expresssions.

### Unicode can impact memory usage and search speed

KQL regex provides first class support for Unicode. In many cases, the extra memory required to support Unicode is negligible and won't typically impact search speed.

The following are some examples of Unicode character classes that may impact memory usage and search speed:

* **Memory usage**: The impact of Unicode primarily arises from the use of Unicode character classes. Unicode character classes tend to be larger in size. For example, the `\w` character class matches around 140,000 distinct codepoints by default. This requires additional memory and can slow down regex compilation. If your requirements can be satisfied by ASCII, it is recommended to use ASCII classes instead of Unicode classes. The ASCII-only version of `\w` can be expressed in multiple ways, all of which are equivalent.

    ```
    [0-9A-Za-z_]
    (?-u:\w)
    [[:word:]]
    [\w&&\p{ascii}]
    ```

* **Search speed**: Unicode tends to be handled pretty well, even when using large Unicode character classes. However, some of the faster internal regex engines cannot handle a Unicode aware word boundary assertion. So if you don't need Unicode-aware word boundary assertions, you might consider using `(?-u:\b)` instead of `\b`. The `(?-u:\b)` uses an ASCII-only definition of a word character, which can improve search speed.

### Literals can accelerate searches

KQL regex has a strong ability to recognize literals within a regex pattern, which can significantly speed up searches. If possible, including literals in your pattern can greatly improve search performance. For example, in the regex `\w+@\w+`, first occurrences of `@` are mathced and then a reverse match is performed for `\w+` to find the starting position.
