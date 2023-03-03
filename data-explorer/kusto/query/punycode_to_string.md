---
title: punycode_to_string - Azure Data Explorer 
description: This article describes the punycode_to_string() command in Azure Data Explorer.
---

# punycode_to_string()

Decodes input string from punycode form.

## Syntax

`punycode_to_string('input_string')`

## Arguments

*input_string*: Input `string`, a string to be decoded from punycode form. The function accepts one string argument.

## Returns

* Returns a `string` that represents the original, decoded string.
* Returns an empty result if decoding failed.

## Example

### Using Kusto

``
print decoded = punycode_to_string('acadmie-franaise-npb1a')
``

**Output:**
"académie-française"

## Next steps

Use [punycode_from_string()](punycode_from_string.md) to encode a string to punycode form.