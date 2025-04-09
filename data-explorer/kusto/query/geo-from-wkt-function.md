---
title:  geo_from_wkt()
description: Learn how to use the geo_from_wkt() function to convert WKT string into GeoJSON shapes.
ms.reviewer: mbrichko
ms.topic: reference
ms.date: 02/23/2025
---
# geo_from_wkt()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Converts WKT string to GeoJSON shape.

## Syntax

`geo_from_wkt(`*wkt*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *wkt* | `string` |  :heavy_check_mark: | Well-known text representation string of geometry.|

## Returns

Shape in [GeoJSON Format](https://tools.ietf.org/html/rfc7946) and of a [dynamic](scalar-data-types/dynamic.md) data type. If the input WKT string is invalid or unsupported, the query produces a null result.

> [!NOTE]
>
> The geospatial coordinates are interpreted as represented by the [WGS-84](https://earth-info.nga.mil/index.php?dir=wgs84&action=wgs84) coordinate reference system.

> [!TIP]
> 
> * Using converted and stored GeoJSON shapes may result in better performance in geospatial analysis.

## Examples

The following example converts point from WKT format to GeoJSON format.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUSjIB5G2Cump%2BfFpRfm58eXZJRpKAf6efiEKGoYKRppKmtYAgd7W7CoAAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
print point = geo_from_wkt("POINT (1 2)");
```

**Output**

|point|
|---|
|{"type": "Point","coordinates": [1,2]}|

The following example converts line from WKT format to GeoJSON format

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUcjJzEtVsFVIT82PTyvKz40vzy7RUPLx9HMNDgny9HNX0DBUMNJRMFYw0VTStAYA45sxNDMAAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
print line = geo_from_wkt("LINESTRING (1 2, 3 4)");
```

**Output**

|line|
|---|
|{"type": "LineString", "coordinates": [[1,2],[3,4]]}|

The following example converts polygon from WKT format to GeoJSON format

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUSjIz6lMz89TsFVIT82PTyvKz40vzy7RUArw94l09%2FdT0NAwUDDQUTCCEEY6CkCupqaSpjUAEHnOWj8AAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
print polygon = geo_from_wkt("POLYGON ((0 0, 2 0, 2 2, 0 0))");
```

**Output**

|polygon|
|---|
|{"type": "Polygon","coordinates": [[[0,0],[2,0],[2,2],[0,0]]]}|

The following example converts multipoint from WKT format to GeoJSON format

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUcgtzSnJLMgHMW0V0lPz49OK8nPjy7NLNJR8Q31CPAP8Pf1CFDQMFQx1FIwUjHQUjBWMNZU0rQHR%2FVPZPgAAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
print multipoint = geo_from_wkt("MULTIPOINT (1 1, 2 2, 3 3)");
```

**Output**

|multipoint|
|---|
|{"type": "MultiPoint","coordinates": [[1,1],[2,2],[3,3]]}|

The following example converts multiline from WKT format to GeoJSON format

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/mbrichko.westeurope.dev/databases/DB11?query=H4sIAAAAAAAAAysoyswrUcgtzSnJzMnMS1WwVUhPzY9PK8rPjS%2FPLtFQ8g31CfH08fRzDQ4J8vRzV9DQMFQw1FEwUjDSUTBWMNbUUdAwUTDRUTBVMNXUVNK0BgDgoMevUAAAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
print multiline = geo_from_wkt("MULTILINESTRING ((1 1, 2 2, 3 3), (4 4, 5 5))");
```

**Output**

|multiline|
|---|
|{"type":"MultiLineString","coordinates":[[[1,1],[2,2],[3,3]],[[4,4],[5,5]]]}|

The following example converts multipolygon from WKT format to GeoJSON format

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUcgtzSnJLMjPqUzPz1OwVUhPzY9PK8rPjS%2FPLtFQ8g31CfEM8PeJdPf3U9DQ0DBQMNBRMIIQRjoKQK6mpo6GhqGBgiFQzNAITgElwYKamppKmtYAU5vOHmoAAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
print multipolygon = geo_from_wkt("MULTIPOLYGON (((0 0, 2 0, 2 2, 0 0)),((10 10, 12 10, 12 12, 10 10)))");
```

**Output**

|multipolygon|
|---|
|{"type": "MultiPolygon","coordinates": [[[[0,0],[2,0],[2,2],[0,0]]],[[[10,10],[12,10],[12,12],[10,10]]]]}|

The following example converts geometry collection from WKT format to GeoJSON format

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAz3KsQrDIBhF4Ve5ZPIHh2iylU5BgmA1pC6ZHIItoUksIpS%2BfZsOnQ58nGde9oJ7TFss%2BR3mtK5xLkvacT403HLawutRWNUrd1F%2BnDpnjOq8dhZscNp6MAFB3Girrn7UtgeTkBwNGo4WLfHBmak%2FfiZqiJpDyH%2B%2B4w%2BJqKLTBz25NNyPAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print geometry_collection = geo_from_wkt("GEOMETRYCOLLECTION (POINT (1 1),LINESTRING (2 2, 3 3, 4 4),POLYGON ((10 10, 12 10, 12 12, 10 10)))");
```

**Output**

|geometry_collection|
|---|
|{"type":"GeometryCollection","geometries":[{"type":"Point","coordinates":[1,1]},{"type":"LineString","coordinates":[[2,2],[3,3],[4,4]]},{"type":"Polygon","coordinates":[[[10,10],[12,10],[12,12],[10,10]]]}]}|

The following example returns a null result because of the invalid WKT string.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShKLS7NKVGwVcgszivNydFIT82PTyvKz40vzy7RUPLx9HMNDgny9HNX0tQEAKksupUxAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print result = isnull(geo_from_wkt("LINESTRING"))
```

**Output**

| result |
|--------|
|  true  |