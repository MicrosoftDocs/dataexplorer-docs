---
title: Geospatial grid systems in Azure Data Explorer
description: Learn about how to cluster geospatial data with Azure Data Explorer.
author: mbrichko
ms.author: mbrichko
ms.reviewer: orspodek
ms.service: data-explorer
ms.topic: how-to
ms.date: 05/18/2021
---

# Geospatial clustering with KQL

Grid systems are highly efficient tools for analyzing vast amounts of geospatial data. With those tools it's possible to aggregate, cluster, partition, reduce, join and index geospatial data which helps to improve query runtime performance, reduce stored data size and visualize aggregated geospatial data.

Azure Data Explorer supports [Geohash](https://en.wikipedia.org/wiki/Geohash), [S2 Cell](https://s2geometry.io/devguide/s2cell_hierarchy) and [H3 Cell](https://eng.uber.com/h3/).

Core functionality:

* Calculate hash\index\cell token of geospatial coordinate. Different geospatial coordinates that belong to same cell will have same cell token value.
* Calculate center point of hash\index\cell token. This is a useful single point that may represent all the values in the cell.
* Calculate cell polygon. Useful in cell visualization or other calculations, for example, distance or point in polygon checks. 

## Comparisons

| Criteria | Geohash | S2 Cell | H3 Cell |
|-|-|-|-|
| Levels of hierarchy | 18 | 31 | 16 |
| Cell shape | Rectangle | Rectangle | Hexagon |
| Cell Edges | straight | geodesic | straight |
| Projection system | None, encodes latitude and longitude | Cube face centered quadratic transform | Icosahedron face centered gnomonic |
| Neighbors count | 8 | 8 | 6 |
| Noticable feature | Common prefixes indicate points proximity | 31 hierarchy levels | Cell shape is hexagon |
| Performance | superb | superb | fast |
| Cover polygon with cells | Not supported | Supported | Not supported |

> [!TIP]
> * In case of lack of preference for any specific tool, use S2 Cell.
> * Although the hashing\indexing of geospatial coordinates is very fast, there are cases where hashing\indexing on ingestion can be applied. From one hand it may improve query runtime, but on the other hand it may increase stored data size.

## Geohash functions

|Function Name|
|-|
|[geo_point_to_geohash()](kusto/query/geo-point-to-geohash-function.md)|
|[geo_geohash_to_central_point()](kusto/query/geo-geohash-to-central-point-function.md)|
|[geo_geohash_to_polygon()](kusto/query/geo-geohash-to-polygon-function.md)|

## S2 Cell functions

|Function Name|
|-|
|[geo_point_to_s2cell()](kusto/query/geo-point-to-s2cell-function.md)|
|[geo_s2cell_to_central_point()](kusto/query/geo-s2cell-to-central-point-function.md)|
|[geo_s2cell_to_polygon()](kusto/query/geo-s2cell-to-polygon-function.md)|
|[geo_polygon_to_s2cells()](kusto/query/geo-polygon-to-s2cells-function.md)|

## H3 Cell functions

|Function Name|
|-|
|[geo_point_to_h3cell()](kusto/query/geo-point-to-h3cell-function.md)|
|[geo_h3cell_to_central_point()](kusto/query/geo-h3cell-to-central-point-function.md)|
|[geo_h3cell_to_polygon()](kusto/query/geo-h3cell-to-polygon-function.md)|
