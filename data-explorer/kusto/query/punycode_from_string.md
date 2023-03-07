---
title: punycode_from_string - Azure Data Explorer 
description: This article describes the punycode_from_string() command in Azure Data Explorer.
---

# punycode_from_string()


Encodes input string to Punycode form. (https://en.wikipedia.org/wiki/Punycode)


## Syntax

`punycode_from_string('input_string')`

## Arguments

*input_string*: Input `string`, a string to be encoded to punycode form. The function accepts one string argument.

## Returns

* Returns a `string` that represents punycode-encoded original string.
* Returns an empty result if encoding failed.

## Example

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
 print encoded = punycode_from_string('académie-française')
```

|encoded|
|---|
|acadmie-franaise-npb1a|

## Next steps

Use [punycode_to_string()](punycode_to_string.md) to retrieve the original decoded string.