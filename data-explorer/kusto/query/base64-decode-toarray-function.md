---
title:  base64_decode_toarray()
description: Learn how to use the base64_decode_toarray() function to decode a base64 string into an array of long values.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# base64_decode_toarray()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Decodes a base64 string to an array of long values.

## Syntax

`base64_decode_toarray(`*base64_string*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
| -- | -- | -- | -- |
| *base64_string* | `string` |  :heavy_check_mark: |  The value to decode from base64 to an array of long values.|

## Returns

Returns an array of long values decoded from a base64 string.

## Examples

The following example shows how to use `base64_decode_toarray()` to decode a base64 string into an array of long values.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUQgszcxLtU1KLE41M4lPSU3OT0mNL8lPLCpKrNRQCjYOq0pxt7BV0lRQ4NLXV1D3VtdRUC8FEcUgogRE5KsDAAf/Q9pKAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print Quine=base64_decode_toarray("S3VzdG8=")  
// 'K', 'u', 's', 't', 'o'
```

**Output**

|Quine|
|-----|
|[75,117,115,116,111]|

## Related content

* To decode base64 strings to a UTF-8 string, see [base64_decode_tostring()](base64-decode-tostring-function.md)
* To encode strings to a base64 string, see [base64_encode_tostring()](base64-encode-tostring-function.md)
