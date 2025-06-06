---
title:  series_cosine_similarity()
description:  This article describes series_cosine_similarity().
ms.reviewer: adieldar
ms.topic: reference
ms.date: 08/11/2024
---
# series_cosine_similarity()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculate the cosine similarity of two numerical vectors.

The function `series_cosine_similarity()` takes two numeric series as input, and calculates their [cosine similarity](https://en.wikipedia.org/wiki/Cosine_similarity).

## Syntax

`series_cosine_similarity(`*series1*`, `*series2*`, [`*magnitude1`, [`*magnitude2`]])`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *series1, series2* | `dynamic` |   :heavy_check_mark: | Input arrays with numeric data. |
| *magnitude1, magnitude2* | `real` |  | Optional magnitude of the first and the second vectors respectively. The magnitude is the square root of the dot product of the vector with itself. If the magnitude isn't provided, it will be calculated. |

## Returns

Returns a value of type `real` whose value is the cosine similarity of *series1* with *series2*.
In case both series length isn't equal, the longer series will be truncated to the length of the shorter one.
Any non-numeric element of the input series will be ignored.

> [!NOTE]
> If one or both input arrays are empty, the result will be `null`.

[!INCLUDE [optimization-note](../includes/vector16-encoding-policy.md)]

## Example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0tJLAHCpJxUjWJDq5TKvMTczGQdhWIjGFuTlyual0sBCKACGtEGeoY6BnpGOlA6VlMHRQ4uCWYYAqVJ0G%2BoY6RjrGMC1hTLy1WjkFpRkpqXolCcWpSZWhyfnF%2BcmZcaX5yZm5mTWJRZUgl0Nci1mgD5D3yExwAAAA%3D%3D" 
target="_blank">Run the query</a>

```kusto
datatable(s1:dynamic, s2:dynamic)
[
    dynamic([0.1,0.2,0.1,0.2]), dynamic([0.11,0.2,0.11,0.21]),
    dynamic([0.1,0.2,0.1,0.2]), dynamic([1,2,3,4]),
]
| extend cosine_similarity=series_cosine_similarity(s1, s2)
```

|s1|s2|cosine_similarity|
|---|---|---|
|[0.1,0.2,0.1,0.2]|[0.11,0.2,0.11,0.21]|0.99935343825504|
|[0.1,0.2,0.1,0.2]|[1,2,3,4]|0.923760430703401|

## Related content

* [ai_embeddings plugin (preview)](ai-embeddings-plugin.md)
