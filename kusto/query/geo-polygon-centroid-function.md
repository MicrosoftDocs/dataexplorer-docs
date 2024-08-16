---
title:  geo_polygon_centroid()
description: Learn how to use the geo_polygon_centroid() function to calculate the centroid of a polygon or a multipolygon on Earth.
ms.reviewer: mbrichko
ms.topic: reference
ms.date: 08/11/2024
---
# geo_polygon_centroid()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculates the centroid of a polygon or a multipolygon on Earth.

## Syntax

`geo_polygon_centroid(`*polygon*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *polygon* | `dynamic` |  :heavy_check_mark: | Polygon or multipolygon in the [GeoJSON format](https://tools.ietf.org/html/rfc7946).|

## Returns

The centroid coordinate values in [GeoJSON Format](https://tools.ietf.org/html/rfc7946) and of a [dynamic](scalar-data-types/dynamic.md) data type. If polygon or multipolygon are invalid, the query produces a null result.

> [!NOTE]
>
> * The geospatial coordinates are interpreted as represented by the [WGS-84](https://earth-info.nga.mil/index.php?dir=wgs84&action=wgs84) coordinate reference system.
> * The [geodetic datum](https://en.wikipedia.org/wiki/Geodetic_datum) used for measurements on Earth is a sphere. Polygon edges are [geodesics](https://en.wikipedia.org/wiki/Geodesic) on the sphere.
> * If input polygon edges are straight cartesian lines, consider using [geo_polygon_densify()](geo-polygon-densify-function.md) to convert planar edges to geodesics.
> * If input is a multipolygon and contains more than one polygon, the result will be the centroid of polygons union.

**Polygon definition and constraints**

dynamic({"type": "Polygon","coordinates": [ LinearRingShell, LinearRingHole_1, ..., LinearRingHole_N ]})

dynamic({"type": "MultiPolygon","coordinates": [[ LinearRingShell, LinearRingHole_1, ..., LinearRingHole_N], ..., [LinearRingShell, LinearRingHole_1, ..., LinearRingHole_M]]})

* LinearRingShell is required and defined as a `counterclockwise` ordered array of coordinates [[lng_1,lat_1],...,[lng_i,lat_i],...,[lng_j,lat_j],...,[lng_1,lat_1]]. There can be only one shell.
* LinearRingHole is optional and defined as a `clockwise` ordered array of coordinates [[lng_1,lat_1],...,[lng_i,lat_i],...,[lng_j,lat_j],...,[lng_1,lat_1]]. There can be any number of interior rings and holes.
* LinearRing vertices must be distinct with at least three coordinates. The first coordinate must be equal to the last. At least four entries are required.
* Coordinates [longitude, latitude] must be valid. Longitude must be a real number in the range [-180, +180] and latitude must be a real number in the range [-90, +90].
* LinearRingShell encloses at most half of the sphere. LinearRing divides the sphere into two regions and chooses the smaller of the two regions.
* LinearRing edge length must be less than 180 degrees. The shortest edge between the two vertices is chosen.
* LinearRings must not cross and must not share edges. LinearRings might share vertices.

## Examples

The following example calculates the Central Park centroid in New York City.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA02PzYqDMBSF9/MUklUFpyS5uT9p6TvMXkREQ5HaRKwbKX33seMIXV049+NwviHMWRviPDVDPTbTLbtk3RKbe98enmpexqBO6icNyzVFVag2panrYzOHhzqVZfnNcPTOY+H0kT35qtgiFM2WyAIC2vdTtCYhDUjGW7NjYrXxzjoH4uSvg8QisQWNzLxjDIZFaK1C8BvmEA0Q6vfZsc8dVfXKz1/j1Md/vdR3q9o1pHrcbOo9Pnzq578zKeEgEAEAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
let central_park = dynamic({"type":"Polygon","coordinates":[[[-73.9495,40.7969],[-73.95807266235352,40.80068603561921],[-73.98201942443848,40.76825672305777],[-73.97317886352539,40.76455136505513],[-73.9495,40.7969]]]});
print centroid = geo_polygon_centroid(central_park)
```

**Output**

|centroid|
|---|
|{"type": "Point", "coordinates": [-73.965735689907618, 40.782550538057812]}|

The following example calculates the Central Park centroid longitude.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA02P3WqEMBBG732KkKtdsJK/mSS79B16LyKiQWxtEtLcyLbvXncl4NXAN2c+5qwuk9H5nIa1j0P6Iu9k2vzwvYyXB81bdPRGP8K6zcHTmo4hpGnxQ3Y/9Na27ZuWjVUWasUabdF29RGBYVogCgkSxHNpGEODTAJyK3jBjGDcKqGUNMq8OtAIQC0kA611wbTk2hjcq0DaA1MAXCKw5yjY+Y+u+7veq5gWn0n18gvLtLvNLvTx0OlLfDn7X6tfElP4dGMmq5/3k4I1J/mWdf/IA8G+OQEAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
let central_park = dynamic({"type":"Polygon","coordinates":[[[-73.9495,40.7969],[-73.95807266235352,40.80068603561921],[-73.98201942443848,40.76825672305777],[-73.97317886352539,40.76455136505513],[-73.9495,40.7969]]]});
print 
centroid = geo_polygon_centroid(central_park)
| project lng = centroid.coordinates[0]
```

**Output**

|lng|
|---|
|-73.9657356899076|

The following example performs union of polygons in multipolygon and calculates the centroid of the unified polygon.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA4WRzWoCQQyA732KZU8KW8lkJn+WPkKh9yIiusiCnRFdD1L67o1ud+2tuQwk32S+TA5tXx3L4bov+Vy9Vrtr3nx229lX3V+Pbb2s3y6HvnsfgLqpt6Wcdl3e9O25Xn54PEtcWDJqEizE2FbNkCIFQWaMFAlvRQVgZYjEwTCMmCIES5hS1KT3HqxILBiBRGTEJAZRZW9F0QYsEYXIBLdjxP56rDw56qF7BH8BReIdEDILComYSGmSCSCE6pqEA+dQskCUWNgmzhjAzZkZAg/9wGdSvxvsIc3B7VRNDWmYjRjMAWKOPH3Bv3Ye3/OXp+Opy49drS+5K3m9bXN/Kt3OV7dvy/q3OqVnIz7/AcPyFDroAQAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
let polygons = dynamic({"type":"MultiPolygon","coordinates":[[[[-73.9495,40.7969],[-73.95807266235352,40.80068603561921],[-73.98201942443848,40.76825672305777],[-73.97317886352539,40.76455136505513],[-73.9495,40.7969]]],[[[-73.94262313842773,40.775991804565585],[-73.98107528686523,40.791849155467695],[-73.99600982666016,40.77092185281977],[-73.96150588989258,40.75609977566361],[-73.94262313842773,40.775991804565585]]]]});
print polygons_union_centroid = geo_polygon_centroid(polygons)
```

**Output**

|polygons_union_centroid|
|---|
|"type": "Point", "coordinates": [-73.968569587829577, 40.776310752555119]}|

The following example visualizes the Central Park centroid on a map.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA02PzYrDIBSF93kKcZVAphj1+tMy7zD7EIIYaaWpihWG0M67T9MQ6OrCuR+H882uIOtCyWYek8lX9I2mJZibt/UDlyU5fMQ/cV7OMeAW2xjz5IMp7o6Pfd9/SXbQXEPLyUFqoYd2i0ARSYWgDBjQ9akIEUoQBqLTtNsxRUmnOeWcKa7eHUJREJIyAlLKHZOsk0qJVxUwvWEcoGMCyHp27HPHMPw1pyplHwqq3n7RTy+3s4tj2nTGPa4//ZvqibILk8vobk0pLtuLyQX9+nJB9dWHteVmUvMPRtRI5jkBAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
let central_park = dynamic({"type":"Polygon","coordinates":[[[-73.9495,40.7969],[-73.95807266235352,40.80068603561921],[-73.98201942443848,40.76825672305777],[-73.97317886352539,40.76455136505513],[-73.9495,40.7969]]]});
print 
centroid = geo_polygon_centroid(central_park)
| render scatterchart with (kind = map)
```

**Output**

:::image type="content" source="media/geo-polygon-centroid-function/nyc-central-park-centroid.png" alt-text="Screenshot of New York City Central park centroid.":::

The following example returns `true` because of the invalid polygon.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA02KQQqAIBAAvyJ7UvCg117RXSRCJRZsV9QOEv29okungZkpFakLbHTkLLfES+E8NqYlJOqVMco4aN0xyBP6KAkmAfO3gIbAXCPS2lN7gnPOaOO1s0bbP1/r/aWUugEuNYE7bwAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
print isnull(geo_polygon_centroid(dynamic({"type": "Polygon","coordinates": [[[0,0],[10,10],[10,10],[0,0]]]})))
```

**Output**

|print_0|
|---|
|true|
