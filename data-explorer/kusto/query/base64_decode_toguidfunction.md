---
title: base64_decode_toguid() - Azure Data Explorer
description: This article describes base64_decode_toguid() in Azure Data Explorer.
services: data-explorer
author: urishapira
ms.author: urishapira
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference 
ms.date: 08/22/2021
---
# base64_decode_toguid()

Decodes a base64 string to a GUID.

## Syntax

`base64_decode_toguid(`*String*`)`

## Arguments

* *String*: Input string to be decoded from base64 to a GUID.

## Returns

Returns a GUID decoded from a base64 string.

* To decode base64 strings to a UTF-8 string, see [base64_decode_tostring()](base64_decode_tostringfunction.md)
* To encode strings to a base64 string, see [base64_encode_tostring()](base64_encode_tostringfunction.md)

## Example

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
print Quine=base64_decode_toguid("JpbpECu8dUy7Pv5gbeJXAA==")  
// 'K', 'u', 's', 't', 'o'
```

|Quine|
|-----|
|10e99626-bc2b-754c-bb3e-fe606de25700|

If you try to decode an invalid base64 string, "null" will be returned:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
print Empty=base64_decode_toarray("abcd1231")
```

|Empty|
|-----|
||
