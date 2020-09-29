---
title: zlib_decompress_from_base64_string() - Azure Data Explorer 
description: This article describes zlib_compress_to_base64_string() and zlib_decompress_from_base64_string() commands in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: elgevork
ms.service: data-explorer
ms.topic: reference
ms.date: 09/29/2020
---
# zlib_decompress_from_base64_string()

Decodes the input string from base64 and then performs zlib decompression.

## Syntax

`zlib_decompress_from_base64_string('input_string')`

## Arguments

* *input_string*: Input `string` that was compressed with zlib and then base64 encoded. The function accepts one string argument.

## Returns

Returns a `string` that represents the original string. Will return an empty result if decompression or decoding failed. A possible reason for an empty output is input that is not a valid zlib compressed and base 64 encoded string.

## Examples

Expression:

```kusto
print zcomp = zlib_decompress_from_base64_string("eJwLSS0uUSguKcrMS1cwNDIGACxqBQ4=")
```

Result:
|Test string 123|

Expression (invalid input):

```kusto
print zcomp = zlib_decompress_from_base64_string("x0x0x0")
```

Result:
||

## Note
- Input string can be produced by the zlib_compress_to_base64_string() function. It can also be created using other tools, for example Python: 
```python
print(base64.b64encode(zlib.compress(b'<original_string>')))
```
- Currently zlib_decompress_from_base64_string command only supports windows size 15.

