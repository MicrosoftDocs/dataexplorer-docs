---
title:   RE2 syntax
description: This article lists the RE2 regular expression syntax accepted by Kusto Query Language (KQL).
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# RE2 syntax

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

This article provides an overview of regular expression syntax supported by [Kusto Query Language (KQL)](index.md), which is the syntax of the RE2 library.

There are a number of KQL operators and functions that perform string matching, selection, and extraction with regular expressions, such as [`matches regex`](matches-regex-operator.md), [`parse`](parse-operator.md), and [`replace_regex()`](replace-regex-function.md).

In KQL, regular expressions must be encoded as [string literals](scalar-data-types/string.md) and follow the string quoting rules. For example, the RE2 regular expression `\A` is represented in KQL as `"\\A"`. The extra backslash indicates that the other backslash is part of the regular expression `\A`.

## Syntax overview

The following table overviews RE2 regular expression syntax, which is used to write regular expressions in Kusto.

| Syntax element | Description |
|--|--|
| Single literals | Single characters match themselves, except for metacharacters (* + ? ( ) \|), which have unique meanings as described in the following rows. |
| Metacharacters | To match a metacharacter literally, escape it with backslashes. For example, the regular expression `\+` matches a literal plus (`+`) character. |
| Alternation |  Alternate two expressions with `|` to create a new expression that matches either of the expressions. For example, `e1 | e2` matches either `e1` or `e2`. |
| Concatenation | Concatenate two expressions to create a new expression that matches the first expression followed by the second. For example, `e1e2` matches `e1` followed by `e2`. |
| Repetition | Metacharacters `?`, `+`, and `*` are repetition operators. For example, `e1?` matches zero or one occurrence of `e1`, `e1+` matches one or more occurrences of `e1`, and `e1*` matches a sequence of zero or more, possibly different, strings that match `e1`.|

> [!NOTE]
> Regular expression operators evaluate in this order: alternation (`|`), concatenation (side-by-side expressions), and repetition (`?`, `+`, `*`). Use parentheses to control the evaluation order.

## Single-character expressions

| Example       |  Description                                                                    |
|----------------|--------------------------------------------------------------------------|
| `.`            | any character, possibly including newline (s=true)                       |
| `[xyz]`        | character class                                                          |
| `[^xyz]`       | negated character class                                                  |
| `\d`           | [Perl character class](https://github.com/google/re2/wiki/Syntax#perl)   |
| `\D`           | negated Perl character class                                             |
| `[[:alpha:]]`  | [ASCII character class](https://github.com/google/re2/wiki/Syntax#ascii) |
| `[[:^alpha:]]` | negated ASCII character class                                            |
| `\pN`          | Unicode character class (one-letter name)                                |
| `\p{Greek}`    | Unicode character class                                                  |
| `\PN`          | negated Unicode character class (one-letter name)                        |
| `\P{Greek}`    | negated Unicode character class                                          |

## Composites

| Example |  Description                   |
|---------|-------------------------|
| `xy`    | `x` followed by `y`     |
| `x\|y`  | `x` or `y` (prefer `x`) |

## Repetitions

| Example   |  Description                                        |
|-----------|----------------------------------------------|
| `x*`      | zero or more `x`, prefer more                |
| `x+`      | one or more `x`, prefer more                 |
| `x?`      | zero or one `x`, prefer one                  |
| `x{n,m}`  | `n` or `n`+1 or ... or `m` `x`, prefer more  |
| `x{n,}`   | `n` or more `x`, prefer more                 |
| `x{n}`    | exactly `n` `x`                              |
| `x*?`     | zero or more `x`, prefer fewer               |
| `x+?`     | one or more `x`, prefer fewer                |
| `x??`     | zero or one `x`, prefer zero                 |
| `x{n,m}?` | `n` or `n`+1 or ... or `m` `x`, prefer fewer |
| `x{n,}?`  | `n` or more `x`, prefer fewer                |
| `x{n}?`   | exactly `n` `x`                              |
| `x{}`     | (≡ `x*`) (NOT SUPPORTED) VIM                |
| `x{-}`    | (≡ `x*?`) (NOT SUPPORTED) VIM               |
| `x{-n}`   | (≡ `x{n}?`) (NOT SUPPORTED) VIM             |
| `x=`      | (≡ `x?`) (NOT SUPPORTED) VIM                |

Implementation restriction: The counting forms x{n,m}, x{n,}, and x{n} reject forms that create a minimum or maximum repetition count above 1000. Unlimited repetitions aren't subject to this restriction.

### Possessive repetitions

| Example   | Description                                       |
|-----------|---------------------------------------------------|
| `x*+`     | zero or more `x`, possessive (NOT SUPPORTED)      |
| `x++`     | one or more `x`, possessive (NOT SUPPORTED)       |
| `x?+`     | zero or one `x`, possessive (NOT SUPPORTED)       |
| `x{n,m}+` | `n` or ... or `m` `x`, possessive (NOT SUPPORTED) |
| `x{n,}+`  | `n` or more `x`, possessive (NOT SUPPORTED)       |
| `x{n}+`   | exactly `n` `x`, possessive (NOT SUPPORTED)       |

## Grouping

| Example        | Description                                                 |
|----------------|-------------------------------------------------------------|
| `(re)`         | numbered capturing group (submatch)                         |
| `(?P<name>re)` | named & numbered capturing group (submatch)                 |
| `(?<name>re)`  | named & numbered capturing group (submatch) (NOT SUPPORTED) |
| `(?'name're)`  | named & numbered capturing group (submatch) (NOT SUPPORTED) |
| `(?:re)`       | noncapturing group                                         |
| `(?flags)`     | set flags within current group; noncapturing               |
| `(?flags:re)`  | set flags during re; noncapturing                          |
| `(?#text)`     | comment (NOT SUPPORTED)                                     |
| `(?\|x\|y\|z)` | branch numbering reset (NOT SUPPORTED)                      |
| `(?>re)`       | possessive match of `re` (NOT SUPPORTED)                    |
| `re@>`         | possessive match of `re` (NOT SUPPORTED) VIM                |
| `%(re)`        | noncapturing group (NOT SUPPORTED) VIM                     |

## Flags

| Example | Description                                                                                     |
|---------|-------------------------------------------------------------------------------------------------|
| `i`     | case-insensitive (default false)                                                                |
| `m`     | multi-line mode: `^` and `$` match begin/end line in addition to begin/end text (default false) |
| `s`     | let `.` match `\n` (default false)                                                              |
| `U`     | ungreedy: swap meaning of `x*` and `x*?`, `x+` and `x+?`, etc (default false)                   |

Flag syntax is xyz (set) or -xyz (clear) or xy-z (set xy, clear z).

To use flags, you must specify the `kind` and `flags` parameters, as follows: `kind=` *regex* `flags=` *regexFlags*.

## Empty strings

| Example   | Description                                                                    |
|-----------|--------------------------------------------------------------------------------|
| `^`       | at beginning of text or line (`m`\=true)                                       |
| `$`       | at end of text (like `\z` not`\Z`) or line (`m`\=true)                         |
| `\A`      | at beginning of text                                                           |
| `\b`      | at ASCII word boundary (`\w` on one side and `\W`, `\A`, or `\z` on the other) |
| `\B`      | not at ASCII word boundary                                                     |
| `\g`      | at beginning of subtext being searched (NOT SUPPORTED) PCRE                    |
| `\G`      | at end of last match (NOT SUPPORTED) PERL                                      |
| `\Z`      | at end of text, or before newline at end of text (NOT SUPPORTED)               |
| `\z`      | at end of text                                                                 |
| `(?=re)`  | before text matching `re` (NOT SUPPORTED)                                      |
| `(?!re)`  | before text not matching `re` (NOT SUPPORTED)                                  |
| `(?<=re)` | after text matching `re` (NOT SUPPORTED)                                       |
| `(?<!re)` | after text not matching `re` (NOT SUPPORTED)                                   |
| `re&`     | before text matching `re` (NOT SUPPORTED) VIM                                  |
| `re@=`    | before text matching `re` (NOT SUPPORTED) VIM                                  |
| `re@!`    | before text not matching `re` (NOT SUPPORTED) VIM                              |
| `re@<=`   | after text matching `re` (NOT SUPPORTED) VIM                                   |
| `re@<!`   | after text not matching `re` (NOT SUPPORTED) VIM                               |
| `\zs`     | sets start of match (= \\K) (NOT SUPPORTED) VIM                                |
| `\ze`     | sets end of match (NOT SUPPORTED) VIM                                          |
| `\%^`     | beginning of file (NOT SUPPORTED) VIM                                          |
| `\%$`     | end of file (NOT SUPPORTED) VIM                                                |
| `\%V`     | on screen (NOT SUPPORTED) VIM                                                  |
| `\%#`     | cursor position (NOT SUPPORTED) VIM                                            |
| `\%'m`    | mark `m` position (NOT SUPPORTED) VIM                                          |
| `\%23l`   | in line 23 (NOT SUPPORTED) VIM                                                 |
| `\%23c`   | in column 23 (NOT SUPPORTED) VIM                                               |
| `\%23v`   | in virtual column 23 (NOT SUPPORTED) VIM                                       |

## Escape sequences

| Example       | Description                                      |
|---------------|--------------------------------------------------|
| `\a`          | bell (≡ `\007`)                                 |
| `\f`          | form feed (≡ `\014`)                            |
| `\t`          | horizontal tab (≡ `\011`)                       |
| `\n`          | newline (≡ `\012`)                              |
| `\r`          | carriage return (≡ `\015`)                      |
| `\v`          | vertical tab character (≡ `\013`)               |
| `\*`          | literal `*`, for any punctuation character `*`   |
| `\123`        | octal character code (up to three digits)        |
| `\x7F`        | hex character code (exactly two digits)          |
| `\x{10FFFF}`  | hex character code                               |
| `\C`          | match a single byte even in UTF-8 mode           |
| `\Q...\E`     | literal text `...` even if `...` has punctuation |
| `\1`          | backreference (NOT SUPPORTED)                    |
| `\b`          | backspace (NOT SUPPORTED) (use `\010`)           |
| `\cK`         | control char ^K (NOT SUPPORTED) (use `\001` etc) |
| `\e`          | escape (NOT SUPPORTED) (use `\033`)              |
| `\g1`         | backreference (NOT SUPPORTED)                    |
| `\g{1}`       | backreference (NOT SUPPORTED)                    |
| `\g{+1}`      | backreference (NOT SUPPORTED)                    |
| `\g{-1}`      | backreference (NOT SUPPORTED)                    |
| `\g{name}`    | named backreference (NOT SUPPORTED)              |
| `\g<name>`    | subroutine call (NOT SUPPORTED)                  |
| `\g'name'`    | subroutine call (NOT SUPPORTED)                  |
| `\k<name>`    | named backreference (NOT SUPPORTED)              |
| `\k'name'`    | named backreference (NOT SUPPORTED)              |
| `\lX`         | lowercase `X` (NOT SUPPORTED)                    |
| `\ux`         | uppercase `x` (NOT SUPPORTED)                    |
| `\L...\E`     | lowercase text `...` (NOT SUPPORTED)             |
| `\K`          | reset beginning of `$0` (NOT SUPPORTED)          |
| `\N{name}`    | named Unicode character (NOT SUPPORTED)          |
| `\R`          | line break (NOT SUPPORTED)                       |
| `\U...\E`     | upper case text `...` (NOT SUPPORTED)            |
| `\X`          | extended Unicode sequence (NOT SUPPORTED)        |
| `\%d123`      | decimal character 123 (NOT SUPPORTED) VIM        |
| `\%xFF`       | hex character FF (NOT SUPPORTED) VIM             |
| `\%o123`      | octal character 123 (NOT SUPPORTED) VIM          |
| `\%u1234`     | Unicode character 0x1234 (NOT SUPPORTED) VIM     |
| `\%U12345678` | Unicode character 0x12345678 (NOT SUPPORTED) VIM |

## Character class elements

| Example   | Description                                   |
|-----------|-----------------------------------------------|
| `x`       | single character                              |
| `A-Z`     | character range (inclusive)                   |
| `\d`      | Perl character class                          |
| `[:foo:]` | ASCII character class `foo`                   |
| `\p{Foo}` | Unicode character class `Foo`                 |
| `\pF`     | Unicode character class `F` (one-letter name) |

### Named character classes as character class elements

| Example       | Description                                                           |
|---------------|-----------------------------------------------------------------------|
| `[\d]`        | digits (≡ `\d`)                                                      |
| `[^\d]`       | not digits (≡ `\D`)                                                  |
| `[\D]`        | not digits (≡ `\D`)                                                  |
| `[^\D]`       | not not digits (≡ `\d`)                                              |
| `[[:name:]]`  | named ASCII class inside character class (≡ `[:name:]`)              |
| `[^[:name:]]` | named ASCII class inside negated character class (≡ `[:^name:]`)     |
| `[\p{Name}]`  | named Unicode property inside character class (≡ `\p{Name}`)         |
| `[^\p{Name}]` | named Unicode property inside negated character class (≡ `\P{Name}`) |

### Perl character classes

ASCII-only

| Example | Description                              |
|---------|------------------------------------------|
| `\d`    | digits (≡ `[0-9]`)                      |
| `\D`    | not digits (≡ `[^0-9]`)                 |
| `\s`    | whitespace (≡ `[\t\n\f\r ]`)            |
| `\S`    | not whitespace (≡ `[^\t\n\f\r ]`)       |
| `\w`    | word characters (≡ `[0-9A-Za-z_]`)      |
| `\W`    | not word characters (≡ `[^0-9A-Za-z_]`) |
| `\h`    | horizontal space (NOT SUPPORTED)         |
| `\H`    | not horizontal space (NOT SUPPORTED)     |
| `\v`    | vertical space (NOT SUPPORTED)           |
| `\V`    | not vertical space (NOT SUPPORTED)       |

### ASCII character classes

| Example        | Description                                                                  |
|----------------|------------------------------------------------------------------------------|
| `[[:alnum:]]`  | alphanumeric (≡ `[0-9A-Za-z]`)                                              |
| `[[:alpha:]]`  | alphabetic (≡ `[A-Za-z]`)                                                   |
| `[[:ascii:]]`  | ASCII (≡ `[\x00-\x7F]`)                                                     |
| `[[:blank:]]`  | blank (≡ `[\t ]`)                                                           |
| `[[:cntrl:]]`  | control (≡ `[\x00-\x1F\x7F]`)                                               |
| `[[:digit:]]`  | digits (≡ `[0-9]`)                                                          |
| `[[:graph:]]`  | graphical (≡ `[!-~]` ≡ `[A-Za-z0-9!"#$%&'()*+,\-./:;<=>?@[\\\]^_` `{ |}~]`) |
| `[[:lower:]]`  | lower case (≡ `[a-z]`)                                                      |
| `[[:print:]]`  | printable (≡ `[ -~]` ≡ `[ [:graph:]]`)                                     |
| `[[:punct:]]`  | punctuation (≡ `[!-/:-@[-` `{-~]`)                                    |
| `[[:space:]]`  | whitespace (≡ `[\t\n\v\f\r ]`)                                              |
| `[[:upper:]]`  | upper case (≡ `[A-Z]`)                                                      |
| `[[:word:]]`   | word characters (≡ `[0-9A-Za-z_]`)                                          |
| `[[:xdigit:]]` | hex digit (≡ `[0-9A-Fa-f]`)                                                 |

### Unicode character class names

#### General

| Example | Description                            |
|---------|----------------------------------------|
| `C`     | other                                  |
| `Cc`    | control                                |
| `Cf`    | format                                 |
| `Cn`    | unassigned code points (NOT SUPPORTED) |
| `Co`    | private use                            |
| `Cs`    | surrogate                              |
| `L`     | letter                                 |
| `LC`    | cased letter (NOT SUPPORTED)           |
| `L&`    | cased letter (NOT SUPPORTED)           |
| `Ll`    | lowercase letter                       |
| `Lm`    | modifier letter                        |
| `Lo`    | other letter                           |
| `Lt`    | titlecase letter                       |
| `Lu`    | uppercase letter                       |
| `M`     | mark                                   |
| `Mc`    | spacing mark                           |
| `Me`    | enclosing mark                         |
| `Mn`    | nonspacing mark                       |
| `N`     | number                                 |
| `Nd`    | decimal number                         |
| `Nl`    | letter number                          |
| `No`    | other number                           |
| `P`     | punctuation                            |
| `Pc`    | connector punctuation                  |
| `Pd`    | dash punctuation                       |
| `Pe`    | close punctuation                      |
| `Pf`    | final punctuation                      |
| `Pi`    | initial punctuation                    |
| `Po`    | other punctuation                      |
| `Ps`    | open punctuation                       |
| `S`     | symbol                                 |
| `Sc`    | currency symbol                        |
| `Sk`    | modifier symbol                        |
| `Sm`    | math symbol                            |
| `So`    | other symbol                           |
| `Z`     | separator                              |
| `Zl`    | line separator                         |
| `Zp`    | paragraph separator                    |
| `Zs`    | space separator                        |

#### Scripts

| Scripts |
| -------------------------------------- |
| `Adlam`                                |
| `Ahom`                                 |
| `Anatolian_Hieroglyphs`                |
| `Arabic`                               |
| `Armenian`                             |
| `Avestan`                              |
| `Balinese`                             |
| `Bamum`                                |
| `Bassa_Vah`                            |
| `Batak`                                |
| `Bengali`                              |
| `Bhaiksuki`                            |
| `Bopomofo`                             |
| `Brahmi`                               |
| `Braille`                              |
| `Buginese`                             |
| `Buhid`                                |
| `Canadian_Aboriginal`                  |
| `Carian`                               |
| `Caucasian_Albanian`                   |
| `Chakma`                               |
| `Cham`                                 |
| `Cherokee`                             |
| `Chorasmian`                           |
| `Common`                               |
| `Coptic`                               |
| `Cuneiform`                            |
| `Cypriot`                              |
| `Cyrillic`                             |
| `Deseret`                              |
| `Devanagari`                           |
| `Dives_Akuru`                          |
| `Dogra`                                |
| `Duployan`                             |
| `Egyptian_Hieroglyphs`                 |
| `Elbasan`                              |
| `Elymaic`                              |
| `Ethiopic`                             |
| `Georgian`                             |
| `Glagolitic`                           |
| `Gothic`                               |
| `Grantha`                              |
| `Greek`                                |
| `Gujarati`                             |
| `Gunjala_Gondi`                        |
| `Gurmukhi`                             |
| `Han`                                  |
| `Hangul`                               |
| `Hanifi_Rohingya`                      |
| `Hanunoo`                              |
| `Hatran`                               |
| `Hebrew`                               |
| `Hiragana`                             |
| `Imperial_Aramaic`                     |
| `Inherited`                            |
| `Inscriptional_Pahlavi`                |
| `Inscriptional_Parthian`               |
| `Javanese`                             |
| `Kaithi`                               |
| `Kannada`                              |
| `Katakana`                             |
| `Kayah_Li`                             |
| `Kharoshthi`                           |
| `Khitan_Small_Script`                  |
| `Khmer`                                |
| `Khojki`                               |
| `Khudawadi`                            |
| `Lao`                                  |
| `Latin`                                |
| `Lepcha`                               |
| `Limbu`                                |
| `Linear_A`                             |
| `Linear_B`                             |
| `Lisu`                                 |
| `Lycian`                               |
| `Lydian`                               |
| `Mahajani`                             |
| `Makasar`                              |
| `Malayalam`                            |
| `Mandaic`                              |
| `Manichaean`                           |
| `Marchen`                              |
| `Masaram_Gondi`                        |
| `Medefaidrin`                          |
| `Meetei_Mayek`                         |
| `Mende_Kikakui`                        |
| `Meroitic_Cursive`                     |
| `Meroitic_Hieroglyphs`                 |
| `Miao`                                 |
| `Modi`                                 |
| `Mongolian`                            |
| `Mro`                                  |
| `Multani`                              |
| `Myanmar`                              |
| `Nabataean`                            |
| `Nandinagari`                          |
| `New_Tai_Lue`                          |
| `Newa`                                 |
| `Nko`                                  |
| `Nushu`                                |
| `Nyiakeng_Puachue_Hmong`               |
| `Ogham`                                |
| `Ol_Chiki`                             |
| `Old_Hungarian`                        |
| `Old_Italic`                           |
| `Old_North_Arabian`                    |
| `Old_Permic`                           |
| `Old_Persian`                          |
| `Old_Sogdian`                          |
| `Old_South_Arabian`                    |
| `Old_Turkic`                           |
| `Odia`                                |
| `Osage`                                |
| `Osmanya`                              |
| `Pahawh_Hmong`                         |
| `Palmyrene`                            |
| `Pau_Cin_Hau`                          |
| `Phags_Pa`                             |
| `Phoenician`                           |
| `Psalter_Pahlavi`                      |
| `Rejang`                               |
| `Runic`                                |
| `Samaritan`                            |
| `Saurashtra`                           |
| `Sharada`                              |
| `Shavian`                              |
| `Siddham`                              |
| `SignWriting`                          |
| `Sinhala`                              |
| `Sogdian`                              |
| `Sora_Sompeng`                         |
| `Soyombo`                              |
| `Sundanese`                            |
| `Syloti_Nagri`                         |
| `Syriac`                               |
| `Tagalog`                              |
| `Tagbanwa`                             |
| `Tai_Le`                               |
| `Tai_Tham`                             |
| `Tai_Viet`                             |
| `Takri`                                |
| `Tamil`                                |
| `Tangut`                               |
| `Telugu`                               |
| `Thaana`                               |
| `Thai`                                 |
| `Tibetan`                              |
| `Tifinagh`                             |
| `Tirhuta`                              |
| `Ugaritic`                             |
| `Vai`                                  |
| `Wancho`                               |
| `Warang_Citi`                          |
| `Yezidi`                               |
| `Yi`                                   |
| `Zanabazar_Square`                     |

### Vim character classes

| Example | Description                                                            |
|---------|------------------------------------------------------------------------|
| `\i`    | identifier character (NOT SUPPORTED) VIM                               |
| `\I`    | `\i` except digits (NOT SUPPORTED) VIM                                 |
| `\k`    | keyword character (NOT SUPPORTED) VIM                                  |
| `\K`    | `\k` except digits (NOT SUPPORTED) VIM                                 |
| `\f`    | file name character (NOT SUPPORTED) VIM                                |
| `\F`    | `\f` except digits (NOT SUPPORTED) VIM                                 |
| `\p`    | printable character (NOT SUPPORTED) VIM                                |
| `\P`    | `\p` except digits (NOT SUPPORTED) VIM                                 |
| `\s`    | whitespace character (≡ `[ \t]`) (NOT SUPPORTED) VIM                  |
| `\S`    | nonwhite space character (≡ `[^ \t]`) (NOT SUPPORTED) VIM            |
| `\d`    | digits (≡ `[0-9]`) VIM                                                |
| `\D`    | not `\d` VIM                                                           |
| `\x`    | hex digits (≡ `[0-9A-Fa-f]`) (NOT SUPPORTED) VIM                      |
| `\X`    | not `\x` (NOT SUPPORTED) VIM                                           |
| `\o`    | octal digits (≡ `[0-7]`) (NOT SUPPORTED) VIM                          |
| `\O`    | not `\o` (NOT SUPPORTED) VIM                                           |
| `\w`    | word character VIM                                                     |
| `\W`    | not `\w` VIM                                                           |
| `\h`    | head of word character (NOT SUPPORTED) VIM                             |
| `\H`    | not `\h` (NOT SUPPORTED) VIM                                           |
| `\a`    | alphabetic (NOT SUPPORTED) VIM                                         |
| `\A`    | not `\a` (NOT SUPPORTED) VIM                                           |
| `\l`    | lowercase (NOT SUPPORTED) VIM                                          |
| `\L`    | not lowercase (NOT SUPPORTED) VIM                                      |
| `\u`    | uppercase (NOT SUPPORTED) VIM                                          |
| `\U`    | not uppercase (NOT SUPPORTED) VIM                                      |
| `\_x`   | `\x` plus newline, for any `x` (NOT SUPPORTED) VIM                     |
| `\c`    | ignore case (NOT SUPPORTED) VIM                                        |
| `\C`    | match case (NOT SUPPORTED) VIM                                         |
| `\m`    | magic (NOT SUPPORTED) VIM                                              |
| `\M`    | nomagic (NOT SUPPORTED) VIM                                            |
| `\v`    | verymagic (NOT SUPPORTED) VIM                                          |
| `\V`    | verynomagic (NOT SUPPORTED) VIM                                        |
| `\Z`    | ignore differences in Unicode combining characters (NOT SUPPORTED) VIM |

## Magic

| Example                | Description                                                  |
|------------------------|--------------------------------------------------------------|
| `(?{code})`            | arbitrary Perl code (NOT SUPPORTED) PERL                     |
| `(??{code})`           | postponed arbitrary Perl code (NOT SUPPORTED) PERL           |
| `(?n)`                 | recursive call to regexp capturing group `n` (NOT SUPPORTED) |
| `(?+n)`                | recursive call to relative group `+n` (NOT SUPPORTED)        |
| `(?-n)`                | recursive call to relative group `-n` (NOT SUPPORTED)        |
| `(?C)`                 | PCRE callout (NOT SUPPORTED) PCRE                            |
| `(?R)`                 | recursive call to entire regexp (≡ `(?0)`) (NOT SUPPORTED)  |
| `(?&name)`             | recursive call to named group (NOT SUPPORTED)                |
| `(?P=name)`            | named backreference (NOT SUPPORTED)                          |
| `(?P>name)`            | recursive call to named group (NOT SUPPORTED)                |
| `(?(cond)true\|false)` | conditional branch (NOT SUPPORTED)                           |
| `(?(cond)true)`        | conditional branch (NOT SUPPORTED)                           |
| `(*ACCEPT)`            | make regexps more like Prolog (NOT SUPPORTED)                |
| `(*COMMIT)`            | (NOT SUPPORTED)                                              |
| `(*F)`                 | (NOT SUPPORTED)                                              |
| `(*FAIL)`              | (NOT SUPPORTED)                                              |
| `(*MARK)`              | (NOT SUPPORTED)                                              |
| `(*PRUNE)`             | (NOT SUPPORTED)                                              |
| `(*SKIP)`              | (NOT SUPPORTED)                                              |
| `(*THEN)`              | (NOT SUPPORTED)                                              |
| `(*ANY)`               | set newline convention (NOT SUPPORTED)                       |
| `(*ANYCRLF)`           | (NOT SUPPORTED)                                              |
| `(*CR)`                | (NOT SUPPORTED)                                              |
| `(*CRLF)`              | (NOT SUPPORTED)                                              |
| `(*LF)`                | (NOT SUPPORTED)                                              |
| `(*BSR_ANYCRLF)`       | set \\R convention (NOT SUPPORTED) PCRE                      |
| `(*BSR_UNICODE)`       | (NOT SUPPORTED) PCRE                                         |
