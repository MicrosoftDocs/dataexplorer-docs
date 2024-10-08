---
title:  url_decode()
description: Learn how to use the url_decode() function to convert an encoded URL into a regular URL representation.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# url_decode()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

The function converts an encoded URL into a regular URL representation.

For more information about URL encoding and decoding, see [Percent-encoding](https://en.wikipedia.org/wiki/Percent-encoding).

## Syntax

`url_decode(`*encoded_url*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *encoded_url* | `string` |  :heavy_check_mark: | The encoded URL to decode.|

## Returns

URL (string) in a regular representation.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVEoLcpRsFVwUM8oKSkoVjVOVDVKA6Ly8nK9pMy8dL3k/FwgV92al6ugKDOvRCG/KDM9My8RpAeoU0chJTU5PyU1BcKNh/A0gExNAHjpCSdcAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
let url = @'https%3a%2f%2fwww.bing.com%2f';
print original = url, decoded = url_decode(url)
```

**Output**

|original|decoded|
|---|---|
|https%3a%2f%2fwww.bing.com%2f|https://www.bing.com/|
