---
title: base64_encode_fromguid() - Azure Data Explorer
description: This article describes base64_encode_fromguid() in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference 
ms.date: 08/31/2021
---
# base64_encode_fromguid()

Encodes a [GUID](./scalar-data-types/guid.md) to a base64 string.

## Syntax

`base64_encode_fromguid(`*guid*`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *guid* | guid | &check; | Value to encode to a base64 string. |

## Returns

Returns a base64 string encoded from a GUID.

## Example

[**Run the query**](https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAx3FQQqAIBAF0KuIq1oIOcqAiw7RCWLMX7hIw/T+QW/znpZLV9vIBWpVUV6w31GOmrCfrd7XyGnq9U8LnHXuJMMgMj4ITFxYjGWwhEiWEPU8fxrJzt9UAAAA)

```kusto
print Quine = base64_encode_fromguid(toguid("ae3133f2-6e22-49ae-b06a-16e6a9b212eb"))  
```

|Quine|
|-----|
|8jMxriJurkmwahbmqbIS6w==|

If you try to encode anything that isn't a [GUID](./scalar-data-types/guid.md) as below, an error will be thrown:

[**Run the query**](https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUXDNLSipVLBVSEosTjUziU/NS85PSY1PK8rPTS/NTNFQSkxKTjE0MjZU0gQApqVKnzAAAAA=)

```kusto
print Empty = base64_encode_fromguid("abcd1231")
```

## See also

* To decode a base64 string to a [GUID](./scalar-data-types/guid.md), see [base64_decode_toguid()](base64-decode-toguid-function.md).
* To create a [GUID](./scalar-data-types/guid.md) from a string, see [toguid()](toguidfunction.md).