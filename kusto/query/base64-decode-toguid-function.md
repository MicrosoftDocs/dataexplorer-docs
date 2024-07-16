---
title:  base64_decode_toguid()
description: Learn how to use base64_decode_toguid() function to return a GUID from a base64 string. 
ms.reviewer: alexans
ms.topic: reference 
ms.date: 11/07/2022
---
# base64_decode_toguid()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Decodes a base64 string to a [GUID](scalar-data-types/guid.md).

## Syntax

`base64_decode_toguid(`*base64_string*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *base64_string* | `string` |  :heavy_check_mark: | The value to decode from base64 to a GUID. |

## Returns

Returns a [GUID](scalar-data-types/guid.md) decoded from a base64 string.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUQgszcxLVbBVSEosTjUziU9JTc5PSY0vyU8vzUzRUPIqSCpwdS61SAmtNA8oM01PSvWKcHS0tVXSBAA/Uk1CPgAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
print Quine = base64_decode_toguid("JpbpECu8dUy7Pv5gbeJXAA==")  
```

**Output**

|Quine|
|-----|
|10e99626-bc2b-754c-bb3e-fe606de25700|

If you try to decode an invalid base64 string, "null" will be returned:

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUXDNLSipVLBVSEosTjUziU9JTc5PSY0vyU8vzUzRUEpMSk4xNDI2VNIEADTfymYuAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print Empty = base64_decode_toguid("abcd1231")
```

## Related content

To encode a [GUID](scalar-data-types/guid.md) to a base64 string, see [base64_encode_fromguid()](base64-encode-fromguid-function.md).
