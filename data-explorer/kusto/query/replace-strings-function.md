---
title: replace_strings() - Azure Data Explorer
description: Learn how to use the replace_strings() function to replace multiple strings matches with multiple replacement strings.
ms.reviewer: alexans
ms.topic: reference
ms.date: 05/21/2023
---
# replace_strings()

Replaces all strings matches with specified strings.

To replace an individual string, see [replace_string()](replace-string-function.md).

## Syntax

`replace_strings(`*text*`,` *lookups*`,` *rewrites*`)`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*text*|string|&check;|The source string.|
|*lookups*|dynamic|&check;|The array that include lookup strings. Array element that isn't a string is ignored.|
|*rewrites*|dynamic|&check;|The array that includes rewrites. Array element that isn't a string is ignored (no replacement made).|

## Returns

Returns *text* after replacing all matches of *lookups* with evaluations of *rewrites*. Matches don't overlap.

## Examples

### Simple replacement

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/adxdocscluster.westeurope/databases/KDA2?query=H4sIAAAAAAAAA22NwQrCMBBE737F0EtaKPQLevCuCF5FJKRLCDWbkGxBwY93i0Uv7mkY5r3NJbDgSLVaT2OzR7Q+OEgJboazDFkKw2oU6DJpnJJvdi/QQ4gnnBZxKRJGFMp36+hWFWZf2x222+z9t5iebGNw7cWo1vQwqjTXrscw4JDSvGRskj/IulUkB0+JlVqh8+d1JJYf0r0BzELQkNwAAAA=" target="_blank">Run the query</a>

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

### Replacement with an empty string

Replacement with an empty string removes the matching string.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/adxdocscluster.westeurope/databases/KDA2?query=H4sIAAAAAAAAA22OwQrCMBBE7/2KoZe0UOgX9OBdEbyKyJIsIdRsQpKCgh9vikU9uKdhmPfYmJwUHDhnsjy1O3iyTqMkp2doEpQlCajGgroMNZpg2+YJvhcWg+NSdPCMCYnjjTRfc4XF5q7Bdpt9+BTmIeSd7s5qtasB6setLv2AccQ+hHmJ2Gx/WOMyxciUVkGlVuj0/sGzlC/SvwDOc7zo5QAAAA==" target="_blank">Run the query</a>

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

### Replacement order

The order of match elements matters: the earlier match takes the precedence.
Note the difference between Outcome1 and Outcome2: 'This' vs 'Thwas'.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/adxdocscluster.westeurope/databases/KDA2?query=H4sIAAAAAAAAA52OzQrCMBAG732Kj17aQqHovW+gCNKbiIR2rcHmhyZBBR/exAZ7EEUMIYdlJzN65NJiTcawnuq0OXEDf5kEXZnQA0Ed4QyXPUbSA2vpYKxnepMXaXL3W5Zkh42zrRK0QP22liCeKClfg+4mmeBtvsuCNiuR+XdflKgqrJQ6O434yRfkwgITkO0kFiTtDBSzLjYu/2ycdE/tr42hbWY+Nz4A0RAvioUBAAA=" target="_blank">Run the query</a>

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

### Non-string replacement

Replace elements that are not strings are not replaced and the original string is kept. The match is still considered to be valid, and other possible replacements are not performed on the matched string. In the following example, 'This' is not replaced with the numeric `12345`, and it remains in the output unaffected by possible match with 'is'.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/adxdocscluster.westeurope/databases/KDA2?query=H4sIAAAAAAAAA2WNywrCMBBF9/2KSzdpoVB8LfsHiiDuRCS0Yww2DzoJKvjxplh00WGYxeWeOX7QNmBHzFJRkx9vmpFWWtBTGt8T3BWRtVUYyPeypQuHxCguyjx7p1Yg22EfQ+sMoZm1MkwzOapf0L2sNLotTmK0igoi3XNZoa6xde4ePaYnc2SxXK03iXjIERmJw9dryIZ/v/wA1+QCUt8AAAA=" target="_blank">Run the query</a>

```kusto
 print Message="This is an example of using replace_strings()"
| extend Outcome = replace_strings(
        Message,
        dynamic(['This', 'is']), // Lookup strings
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

