---
title: zlib_compress_to_base64_string - Azure Data Explorer 
description: This article describes zlib_compress_to_base64_string() and zlib_decompress_from_base64_string() commands in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: elgevork
ms.service: data-explorer
ms.topic: reference
ms.date: 09/29/2020
---

# zlib_compress_to_base64_string()

This function performs zlib compression and then encodes the result to base64.

## Syntax

`zlib_compress_to_base64_string('input_string')`

## Arguments

* *input_string*: Input `string`, a string that needs to be compressed and base64 encoded. The function accepts one string argument.

## Returns

Returns a `string` that represents zlib compressed and base64 encoded original string. Will return an empty result if compression or encoding failed.

## Example

Expression:
```kusto
print zcomp = zlib_compress_to_base64_string("1234567890qwertyuiop")
```

Result:
|"eAEBFADr/zEyMzQ1Njc4OTBxd2VydHl1aW9wOAkGdw=="|

## Note
- zlib_decompress_from_base64_string function can be used to retrieve the original uncompressed string.
- Currently the only supported windows size is 15.


