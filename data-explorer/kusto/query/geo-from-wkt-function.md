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

## Examples

The following example converts point from WKT format to GeoJSON format

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
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUcjJzEtVsFVIT82PTyvKz40vzy7RUPLx9HMNDgny9HNX0DBWMNRRMFQw1lEwUTDRVNK0BgBoeIe2OAAAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
print line = geo_from_wkt("LINESTRING (3 1, 1 3, 4 4)");
```

**Output**

|line|
|---|
|{"type": "LineString", "coordinates": [[3,1],[1,3],[4,4]]}|

The following example converts polygon from WKT format to GeoJSON format

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUcjJzEtVsFVIT82PTyvKz40vzy7RUArw94l09%2FdT0NAwVjDUUTBRMNFRMAIRhgpGOgpAMU1NJU1rABzaT9xBAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print polygon = geo_from_wkt("POLYGON ((3 1, 4 4, 2 4, 1 2, 3 1))");
```

**Output**

|polygon|
|---|
|{"type": "Polygon","coordinates": [[[3,1],[4,4],[2,4],[1,2],[3,1]]]}|

The following example converts multipoint from WKT format to GeoJSON format

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUcgtzSnJLMgHMW0V0lPz49OK8nPjy7NLNJR8Q31CPAP8Pf1CFDQMFUx0FEwUjHUUjBSMdBSMFQw1lTStAbb8a1RDAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print multipoint = geo_from_wkt("MULTIPOINT (1 4, 4 3, 2 2, 3 1)");
```

**Output**

|multipoint|
|---|
|{"type": "MultiPoint","coordinates": [[1,4],[4,3],[2,2],[3,1]]}|

The following example converts multiline from WKT format to GeoJSON format

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAxXIvQqAIBQG0Ff5aFK4y9W7RWOEYA39zE0VUmmE0etHZzzXHWLG%2BRw5HCEuqLAtaV7vdM7vnlXRTn503nX1MPaua6AUgwkGhsAQTVACIVhYgvxrwVoXuvwAz0eYvFoAAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
print multiline = geo_from_wkt("MULTILINESTRING ((1 1, 2 2, 1 4), (4 4, 3 3, 4 2, 3 1))");
```

**Output**

|multiline|
|---|
|{"type":"MultiLineString","coordinates":[[[1,1],[2,2],[1,4]],[[4,4],[3,3],[4,2],[3,1]]]}|

The following example converts multipolygon from WKT format to GeoJSON format

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUcgtzSnJLMjPqUzPz1OwVUhPzY9PK8rPjS%2FPLtFQ8g31CfEM8PeJdPf3U9DQ0DA2UDAy0FEwMVUwAVKGBmAKLKipqaOhYWiqYAqUNQDKgGVBak0hHKCMpqamkqY1AM%2FtBP52AAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print multipolygon = geo_from_wkt("MULTIPOLYGON (((30 20, 45 40, 10 40, 30 20)),((15 5, 40 10, 10 20, 5 10, 15 5)))");
```

**Output**

|multipolygon|
|---|
|{"type": "MultiPolygon","coordinates": [[[[30,20],[45,40],[10,40],[30,20]]],[[[15,5],[40,10],[10,20],[5,10],[15,5]]]]}|

The following example converts geometry collection from WKT format to GeoJSON format

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUhPzc9NLSmqjE%2FOz8lJTS7JzM9TsAWJxqcV5efGl2eXaCi5u%2Fr7uoYERTr7%2B%2Fi4Ood4%2BvspaAT4e%2FqFKGiYGCgYGmjq%2BHj6uQaHBHn6uStoGIKEdBSMDIBIB8hUMAEqCPD3iXQH6QPpMIFIm5jqALGCMZAHFtTU1FTStAYAthtKa5cAAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
print geometry_collection = geo_from_wkt("GEOMETRYCOLLECTION (POINT (40 10),LINESTRING (10 10, 20 20, 10 40),POLYGON ((40 40, 20 45, 45 30, 40 40)))");
```

**Output**

|geometry_collection|
|---|
|{"type": "GeometryCollection","geometries": [{"type": "Point","coordinates": [40,10]},{"type": "LineString","coordinates": [[10,10],[20,20],[10,40]]},{"type": "Polygon","coordinates": [[[40,40],[20,45],[45,30],[40,40]]]}]}|

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