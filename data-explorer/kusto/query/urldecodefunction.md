---
title: url_decode() - Azure Data Explorer
description: This article describes url_decode() in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/15/2023
---
# url_decode()

The function converts encoded URL into a regular URL representation.

For more details information about URL encoding and decoding, see [Percent-encoding](https://en.wikipedia.org/wiki/Percent-encoding).

## Syntax

`url_decode(`*encoded_url*`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *encoded_url* | string | &check; | The encoded URL to decode.|

## Returns

URL (string) in a regular representation.

## Example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVEoLcpRsFVwUM8oKSkoVjVOVDVKA6Ly8nK9pMy8dL3k/FwgV92al6ugKDOvRCG/KDM9My8RpAeoU0chJTU5PyU1BcKNh/A0gExNAHjpCSdcAAAA" target="_blank">Run the query</a>

```kusto
let url = @'https%3a%2f%2fwww.bing.com%2f';
print original = url, decoded = url_decode(url)
```

**Output**

|original|decoded|
|---|---|
|https%3a%2f%2fwww.bing.com%2f|https://www.bing.com/|
