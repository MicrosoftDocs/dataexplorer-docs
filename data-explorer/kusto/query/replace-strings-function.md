---
title: replace_strings() - Azure Data Explorer
description: Learn how to use the replace_strings() function to replace multiple strings matches with multiple replacement strings.
ms.reviewer: alexans
ms.topic: reference
ms.date: 03/12/2023
---
# replace_strings()

Replaces all strings matches with another strings.

## Syntax

`replace_strings(`*text*`,` *lookups*`,` *rewrites*`)`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*text*|string|&check;|The source string.|
|*lookups*|dynamic|&check;|The array that include lookup strings. Array element that isn't a string is ignored.|
|*rewrites*|dynamic|&check;|The array that includes rewrites. Array element that isn't a string is ignored (no replacement made).|

## Returns

*text* after replacing all matches of *lookups* with evaluations of *rewrites*. Matches don't overlap.

## Examples


```kusto
print Message="A magic trick can turn a cat into a dog"
| extend Outcome = replace_strings(
        Message,
        dynamic(['cat', 'dog']), // Lookup strings
        dynamic(['dog', 'pigeon']) // Replacements
        )
```

|Message|Outcome|
|---|---|
|A magic trick can turn a cat into a dog|A magic trick can turn a dog into a pigeon|

Replacement with empty string removes the matching string.

```kusto
print Message="A magic trick can turn a cat into a dog"
| extend Outcome = replace_strings(
        Message,
        dynamic(['turn', ' into a dog']), // Lookup strings
        dynamic(['disappear', '']) // Replacements
        )
```

|Message|Outcome|
|---|---|
|A magic trick can turn a cat into a dog|A magic trick can disappear a cat|

Order of match elements matters: the earlier match takes the precedence.
Note the difference between Outcome1 and Outcome2: 'This' vs 'Thwas'.

```kusto
 print Message="This is an example of using replace_strings()"
| extend Outcome1 = replace_strings(
        Message,
        dynamic(['This', 'is']), // Lookup strings
        dynamic(['This', 'was']) // Replacements
        ),
        Outcome2 = replace_strings(
        Message,
        dynamic(['is', 'This']), // Lookup strings
        dynamic(['was', 'This']) // Replacements
        )
```

|Message|Outcome1|Outcome2|
|---|---|---|
|This is an example of using replace_strings()|This was an example of using replace_strings()|Thwas was an example of using replace_strings()|

Replace elements that are not strings are not replaced (original string is kept). The match is still considered to be valid, other possible replacements are not taking place for the matched string. In the following example, 'This' is not replaced with the numeric `12345`, and it remains in the output unaffected by possible match with 'is'.

```kusto
 print Message="This is an example of using replace_strings()"
| extend Outcome = replace_strings(
        Message,
        dynamic(['This', 'is']), // Lookup strins
        dynamic([12345, 'was']) // Replacements
        )
```

|Message|Outcome|
|---|---|
|This is an example of using replace_strings()|This was an example of using replace_strings()|


## See also

* For a replacement of a single string, see [replace_string()](replace-string-function.md).
* For a replacement based on regular expression, see [replace_regex()](replace-regex-function.md).
* For replacing a set of characters, see [translate()](translatefunction.md).

