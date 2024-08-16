---
title:  geo_h3cell_to_central_point()
description: Learn how to use the geo_h3cell_to_central_point() function to calculate the geospatial coordinates that represent the center of an H3 cell.
ms.reviewer: mbrichko
ms.topic: reference
ms.date: 08/11/2024
---
# geo_h3cell_to_central_point()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculates the geospatial coordinates that represent the center of an H3 Cell.

Read more about [H3 Cell](https://eng.uber.com/h3/).

## Syntax

`geo_h3cell_to_central_point(`*h3cell*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *h3cell* | `string` |  :heavy_check_mark: | An H3 Cell token value as it was calculated by [geo_point_to_h3cell()](geo-point-to-h3cell-function.md).|

## Returns

The geospatial coordinate values in [GeoJSON Format](https://tools.ietf.org/html/rfc7946) and of a [dynamic](scalar-data-types/dynamic.md) data type. If the H3 cell token is invalid, the query will produce a null result.

> [!NOTE]
> The GeoJSON format specifies longitude first and latitude second.

## Examples

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUcgwTk7NyVGwVUhPzY+HcOJL8uOTU/NKihJz4gvygYo0lCzMjBINDcyN0iBASRMA4+TrCj0AAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print h3cell = geo_h3cell_to_central_point("862a1072fffffff")
```

**Output**

|h3cell|
|---|
|{<br>"type": "Point",<br>"coordinates": [-74.016008479792447, 40.7041679083504]<br>}|

The following example returns the longitude of the H3 Cell center point:

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUcjJz0vPLClNSVWwVUhPzY/PME5OzcmJL8mPT07NKylKzIkvyAeq01CyMDNKNDQwN0qDACVNveT8/KKUzLzEktTiaINYALPfSvhPAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print longitude = geo_h3cell_to_central_point("862a1072fffffff").coordinates[0]
```

**Output**

|longitude|
|---|
|-74.0160084797924|

The following example returns a null result because of the invalid H3 cell token input.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUcgwTk7NyVGwVUhPzY+HcOJL8uOTU/NKihJz4gvygYo0lAyVNAFOq4ZHLwAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
print h3cell = geo_h3cell_to_central_point("1")
```

**Output**

|h3cell|
|---|
||
