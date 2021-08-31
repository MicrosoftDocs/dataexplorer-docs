---
title: base64_encode_fromguid() - Azure Data Explorer
description: This article describes base64_encode_fromguid() in Azure Data Explorer.
services: data-explorer
author: urishapira
ms.author: urishapira
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference 
ms.date: 08/31/2021
---
# base64_decode_toguid()

Encodes a GUID to abase64 string.

## Syntax

`base64_encode_fromguid(`*GUID*`)`

## Arguments

* *GUID*: Input GUID to be encoded to a base64 string. 

## Returns

Returns a base64 string encoded from a GUID.

* To decode base64 strings to a GUID, see [base64_decode_toguid()](base64_decode_toguidfunction.md)


## Example

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
print Quine=base64_encode_fromguid(toguid("ae3133f2-6e22-49ae-b06a-16e6a9b212eb"))  
// 'K', 'u', 's', 't', 'o'
```

|Quine|
|-----|
|8jMxriJurkmwahbmqbIS6w==|

If you try to decode anything that is not a GUID as below, an error will be thrown:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
print Empty=base64_encode_fromguid("abcd1231")
```
