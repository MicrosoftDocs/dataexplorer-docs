---
title: Geospatial grid systems in Azure Data Explorer
description: Learn about how to cluster geospatial data with Azure Data Explorer.
author: orspod
ms.author: orspodek
ms.reviewer: mbrichko
ms.service: data-explorer
ms.topic: reference
ms.date: 06/03/2021
---

# Geospatial clustering

Geospatial data can be analyzed efficiently using grid systems to create geospatial clusters. You can use geospatial tools to aggregate, cluster, partition, reduce, join, and index geospatial data. These tools helps to improve query runtime performance, reduce stored data size, and visualize aggregated geospatial data.

Azure Data Explorer supports the following methods of geospatial clustering:

* [Geohash](https://en.wikipedia.org/wiki/Geohash)
* [S2 Cell](https://s2geometry.io/devguide/s2cell_hierarchy)
* [H3 Cell](https://eng.uber.com/h3/)

The core functionalities of these methods are:

* Calculate hash\index\cell token of geospatial coordinate. Different geospatial coordinates that belong to same cell will have same cell token value.
* Calculate center point of hash\index\cell token. This is a useful single point that may represent all the values in the cell.
* Calculate cell polygon. Useful in cell visualization or other calculations, for example, distance or point in polygon checks. 

## Compare methods

| Criteria | Geohash | S2 Cell | H3 Cell |
|---|---|---|---|
| Levels of hierarchy | 18 | 31 | 16 |
| Cell shape | Rectangle | Rectangle | Hexagon |
| Cell Edges | straight | geodesic | straight |
| Projection system | None. Encodes latitude and longitude | Cube face centered quadratic transform | Icosahedron face centered gnomonic |
| Neighbors count | 8 | 8 | 6 |
| Noticeable feature | Common prefixes indicate points proximity | 31 hierarchy levels | Cell shape is hexagonal |
| Performance | superb | superb | fast |
| Cover polygon with cells | Not supported | Supported | Not supported |

> [!TIP]
> If there is no preference for a specific tool, use [S2 Cell](#s2-cell-functions).

> [!NOTE]
> Although the hashing\indexing of geospatial coordinates is very fast, there are cases where hashing\indexing on ingestion can be applied to improve query runtime. However, this process may increase stored data size.

## Geohash functions

|Function Name|
|---|
|[geo_point_to_geohash()](kusto/query/geo-point-to-geohash-function.md)|
|[geo_geohash_to_central_point()](kusto/query/geo-geohash-to-central-point-function.md)|
|[geo_geohash_to_polygon()](kusto/query/geo-geohash-to-polygon-function.md)|

## S2 Cell functions

|Function Name|
|---|
|[geo_point_to_s2cell()](kusto/query/geo-point-to-s2cell-function.md)|
|[geo_s2cell_to_central_point()](kusto/query/geo-s2cell-to-central-point-function.md)|
|[geo_s2cell_to_polygon()](kusto/query/geo-s2cell-to-polygon-function.md)|
|[geo_polygon_to_s2cells()](kusto/query/geo-polygon-to-s2cells-function.md)|

## H3 Cell functions

|Function Name|
|---|
|[geo_point_to_h3cell()](kusto/query/geo-point-to-h3cell-function.md)|
|[geo_h3cell_to_central_point()](kusto/query/geo-h3cell-to-central-point-function.md)|
|[geo_h3cell_to_polygon()](kusto/query/geo-h3cell-to-polygon-function.md)|
