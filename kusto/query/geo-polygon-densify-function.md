---
title:  geo_polygon_densify()
description: Learn how to use the geo_polygon_densify() function to convert polygon or multipolygon planar edges to geodesics.
ms.reviewer: mbrichko
ms.topic: reference
ms.date: 08/11/2024
---
# geo_polygon_densify()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Converts polygon or multipolygon planar edges to geodesics by adding intermediate points.

## Syntax

`geo_polygon_densify(`*polygon*`,` *tolerance*`,` [ *preserve_crossing* ]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *polygon* | `dynamic` |  :heavy_check_mark: | Polygon or multipolygon in the [GeoJSON format](https://tools.ietf.org/html/rfc7946).|
| *tolerance* | int, long, or real | | Defines maximum distance in meters between the original planar edge and the converted geodesic edge chain. Supported values are in the range [0.1, 10000]. If unspecified, the default value is  `10`.|
| *preserve_crossing* | `bool` | | If `true`, preserves edge crossing over antimeridian. If unspecified, the default value `false` is used.|

### Polygon definition

dynamic({"type": "Polygon","coordinates": [ LinearRingShell, LinearRingHole_1, ..., LinearRingHole_N ]})

dynamic({"type": "MultiPolygon","coordinates": [[ LinearRingShell, LinearRingHole_1, ..., LinearRingHole_N ], ..., [LinearRingShell, LinearRingHole_1, ..., LinearRingHole_M]]})

* `LinearRingShell` is required and defined as a `counterclockwise` ordered array of coordinates [[lng_1,lat_1],...,[lng_i,lat_i],...,[lng_j,lat_j],...,[lng_1,lat_1]]. There can be only one shell.
* `LinearRingHole` is optional and defined as a `clockwise` ordered array of coordinates [[lng_1,lat_1],...,[lng_i,lat_i],...,[lng_j,lat_j],...,[lng_1,lat_1]]. There can be any number of interior rings and holes.
* `LinearRing` vertices must be distinct with at least three coordinates. The first coordinate must be equal to the last. At least four entries are required.
* Coordinates [longitude, latitude] must be valid. Longitude must be a real number in the range [-180, +180] and latitude must be a real number in the range [-90, +90].
* `LinearRingShell` encloses at most half of the sphere. LinearRing divides the sphere into two regions. The smaller of the two regions will be chosen.
* `LinearRing` edge length must be less than 180 degrees. The shortest edge between the two vertices will be chosen.

### Constraints

* The maximum number of points in the densified polygon is limited to 10485760.
* Storing polygons in [dynamic](scalar-data-types/dynamic.md) format has size limits.
* Densifying a valid polygon may invalidate the polygon. The algorithm adds points in a non-uniform manner, and as such may cause edges to intertwine with each other.

### Motivation

* [GeoJSON format](https://tools.ietf.org/html/rfc7946) defines an edge between two points as a straight cartesian line while `geo_polygon_densify()` uses [geodesic](https://en.wikipedia.org/wiki/Geodesic).
* The decision to use geodesic or planar edges might depend on the dataset and is especially relevant in long edges.

## Returns

Densified polygon in the [GeoJSON format](https://tools.ietf.org/html/rfc7946) and of a [dynamic](scalar-data-types/dynamic.md) data type. If either the polygon or tolerance is invalid, the query produces a null result.

> [!NOTE]
> The geospatial coordinates are interpreted as represented by the [WGS-84](https://earth-info.nga.mil/index.php?dir=wgs84&action=wgs84) coordinate reference system.

## Examples

The following example densifies Manhattan Central Park polygon. The edges are short and the distance between planar edges and their geodesic counterparts is less than the distance specified by tolerance. As such, the result remains unchanged.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA13MSwrDIABF0a2IIwNpMGr8BLqHziWEEG0QWpXoREr33o+kg07Pe9y4O5+BsT65q7NmjuFWtuDBGeSQ8nvc0GbDwXM9FmSKX+5uRQ+YS7RwhJd6gC1cQ9iN80u2CY5a65OgnRokYaxluJMYi15NbWWmesY/LBRXw6GCYkW/yhkh/GBJMCeVZT/8Gv/paXo2TfMCwhc/8NgAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print densified_polygon = tostring(geo_polygon_densify(dynamic({"type":"Polygon","coordinates":[[[-73.958244,40.800719],[-73.949146,40.79695],[-73.973093,40.764226],[-73.982062,40.768159],[-73.958244,40.800719]]]})))
```

**Output**

|densified_polygon|
|---|
|{"type":"Polygon","coordinates":[[[-73.958244,40.800719],[-73.949146,40.79695],[-73.973093,40.764226],[-73.982062,40.768159],[-73.958244,40.800719]]]}|

The following example densifies two edges of the polygon. Densified edges length is ~110 km

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0XKQQrDIBCF4avIrBRcONtA7tC9SAjRykA6I3E2Unr3tISS1Qfv/e0gVpMLd3pSyUuTfVRhMxuVrt+z2lrkPy9XOGwevL5os2/Q0QpM8LgC8LCJHJl41dJhijFi8BiSj4i3+DPchpTSxzl3AtyuS1uOAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print densified_polygon = tostring(geo_polygon_densify(dynamic({"type":"Polygon","coordinates":[[[10,10],[11,10],[11,11],[10,11],[10,10]]]})))
```

**Output**

|densified_polygon|
|---|
|{"type":"Polygon","coordinates":[[[10,10],[10.25,10],[10.5,10],[10.75,10],[11,10],[11,11],[10.75,11],[10.5,11],[10.25,11],[10,11],[10,10]]]}|

The following example returns a null result because of the invalid coordinate input.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUhJzSvOTMtMTYkvyM+pTM/PU7BVSE/Nh/HiIfKVGimVeYm5mcka1UollQWpSlZKARAFSjpKyfn5RSmZeYklqcVKVtHR0YYGOpYGBrE60YaGOoYw2hBEGyBog9jY2FpNTQDqeX/DhQAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
print densified_polygon = geo_polygon_densify(dynamic({"type":"Polygon","coordinates":[[[10,900],[11,10],[11,11],[10,11],[10,10]]]}))
```

**Output**

|densified_polygon|
|---|
||

The following example returns a null result because of the invalid tolerance input.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUhJzSvOTMtMTYkvyM+pTM/PU7BVSE/Nh/HiIfKVGimVeYm5mcka1UollQWpSlZKARAFSjpKyfn5RSmZeYklqcVKVtHR0YYGOoYGsTrRhoYI2hBEGyBog9jY2FpNHQUDTQCMm+c8hwAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
print densified_polygon = geo_polygon_densify(dynamic({"type":"Polygon","coordinates":[[[10,10],[11,10],[11,11],[10,11],[10,10]]]}), 0)
```

**Output**

|densified_polygon|
|---|
||
