---
title:  zlib_compress_to_base64_string 
description:  This article describes the zlib_compress_to_base64_string() command.
ms.reviewer: elgevork
ms.topic: reference
ms.date: 08/11/2024
---

# zlib_compress_to_base64_string()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Performs zlib compression and encodes the result to base64.

> [!NOTE]
> The only supported windows size is 15.

## Syntax

`zlib_compress_to_base64_string(`*string*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *string* | `string` |  :heavy_check_mark: | The string to be compressed and base64 encoded.|

## Returns

* Returns a `string` that represents zlib-compressed and base64-encoded original string. 
* Returns an empty result if compression or encoding failed.

## Example

### Using Kusto Query Language

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUahKzs8tULBVqMrJTIoHsYtSi4vjS/LjkxKLU81M4otLgMrSNZQMjYxNTM3MLSwNCstTi0oqSzPzC5Q0Ad0xYSFEAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print zcomp = zlib_compress_to_base64_string("1234567890qwertyuiop")
```

**Output**

|zcomp|
|--|
|"eAEBFADr/zEyMzQ1Njc4OTBxd2VydHl1aW9wOAkGdw=="|

### Using Python

Compression can be done using other tools, for example Python.

```python
print(base64.b64encode(zlib.compress(b'<original_string>')))
```

## Related content

* Use [zlib_decompress_from_base64_string()](zlib-base64-decompress-function.md) to retrieve the original uncompressed string.
