---
title:  base64_encode_fromguid()
description: Learn how to use the base64_encode_fromguid() function to return a base64 string from a GUID.
ms.reviewer: alexans
ms.topic: reference 
ms.date: 08/11/2024
---
# base64_encode_fromguid()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Encodes a [GUID](scalar-data-types/guid.md) to a base64 string.

## Syntax

`base64_encode_fromguid(`*guid*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *guid* | `guid` |  :heavy_check_mark: | The value to encode to a base64 string. |

## Returns

Returns a base64 string encoded from a GUID.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAx3FQQqAIBAF0KuIq1oIOcqAiw7RCWLMX7hIw/T+QW/znpZLV9vIBWpVUV6w31GOmrCfrd7XyGnq9U8LnHXuJMMgMj4ITFxYjGWwhEiWEPU8fxrJzt9UAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print Quine = base64_encode_fromguid(toguid("ae3133f2-6e22-49ae-b06a-16e6a9b212eb"))  
```

**Output**

|Quine|
|-----|
|8jMxriJurkmwahbmqbIS6w==|

If you try to encode anything that isn't a [GUID](scalar-data-types/guid.md) as below, an error will be thrown:

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUXDNLSipVLBVSEosTjUziU/NS85PSY1PK8rPTS/NTNFQSkxKTjE0MjZU0gQApqVKnzAAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print Empty = base64_encode_fromguid("abcd1231")
```

## Related content

* To decode a base64 string to a [GUID](scalar-data-types/guid.md), see [base64_decode_toguid()](base64-decode-toguid-function.md).
* To create a [GUID](scalar-data-types/guid.md) from a string, see [toguid()](toguid-function.md).