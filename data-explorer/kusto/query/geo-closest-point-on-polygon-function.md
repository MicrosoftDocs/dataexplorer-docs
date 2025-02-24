---
title:  geo_closest_point_on_polygon()
description: Learn how to use the geo_closest_point_on_polygon() function to calculate a point on a polygon or a multipolygon, which is closest to a given point on Earth.
ms.reviewer: mbrichko
ms.topic: reference
ms.date: 02/23/2025
---
# geo_closest_point_on_polygon()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculates a point on a polygon or a multipolygon, which is closest to a given point on Earth.

## Syntax

`geo_closest_point_on_polygon(`*longitude*`,`*latitude*`,`*polygon*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *longitude* | `real` |  :heavy_check_mark: | Geospatial coordinate, longitude value in degrees. Valid value is a real number and in the range [-180, +180].|
| *latitude* | `real` |  :heavy_check_mark: | Geospatial coordinate, latitude value in degrees. Valid value is a real number and in the range [-90, +90].|
| *polygon* | `dynamic` |  :heavy_check_mark: | Polygon or multipolygon in the [GeoJSON format](https://tools.ietf.org/html/rfc7946).|

## Returns

A point in [GeoJSON Format](https://tools.ietf.org/html/rfc7946) and of a [dynamic](scalar-data-types/dynamic.md) data type on a polygon or multipolygon which is the closest to a given point on Earth. If polygon contains input point, the result with be the same point. If the coordinates or polygons are invalid, the query produces a null result.

> [!NOTE]
>
> * The geospatial coordinates are interpreted as represented by the [WGS-84](https://earth-info.nga.mil/index.php?dir=wgs84&action=wgs84) coordinate reference system.
> * The [geodetic datum](https://en.wikipedia.org/wiki/Geodetic_datum) used for measurements on Earth is a sphere. Polygon edges are [geodesics](https://en.wikipedia.org/wiki/Geodesic) on the sphere.
> * If input polygon edges are straight cartesian lines, consider using [geo_polygon_densify()](geo-polygon-densify-function.md) to convert planar edges to geodesics.
> * In order to calculate a distance between the closest point on a polygon or multipolygon to a given point, use [geo_distance_point_to_polygon()](geo-distance-point-to-polygon-function.md)

**Polygon definition and constraints**

dynamic({"type": "Polygon","coordinates": [LinearRingShell, LinearRingHole_1, ..., LinearRingHole_N]})

dynamic({"type": "MultiPolygon","coordinates": [[LinearRingShell, LinearRingHole_1,..., LinearRingHole_N],..., [LinearRingShell, LinearRingHole_1,..., LinearRingHole_M]]})

* LinearRingShell is required and defined as a `counterclockwise` ordered array of coordinates [[lng_1,lat_1],...,[lng_i,lat_i],...,[lng_j,lat_j],...,[lng_1,lat_1]]. There can be only one shell.
* LinearRingHole is optional and defined as a `clockwise` ordered array of coordinates [[lng_1,lat_1],...,[lng_i,lat_i],...,[lng_j,lat_j],...,[lng_1,lat_1]]. There can be any number of interior rings and holes.
* LinearRing vertices must be distinct with at least three coordinates. The first coordinate must be equal to the last. At least four entries are required.
* Coordinates [longitude, latitude] must be valid. Longitude must be a real number in the range [-180, +180] and latitude must be a real number in the range [-90, +90].
* LinearRingShell encloses at most half of the sphere. LinearRing divides the sphere into two regions. The smaller of the two regions will be chosen.
* LinearRing edge length must be less than 180 degrees. The shortest edge between the two vertices will be chosen.
* LinearRings must not cross and must not share edges. LinearRings may share vertices.
* Polygon doesn't necessarily contain its vertices.

> [!TIP]
>
> * Using literal polygons may result in better performance.

## Examples

The following example calculates a location in Central Park which is the closest to a given point.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WQy2rDMBBF94X8g9AqASfoNQ%2Bl9B%2B6N8YYRwQTRzK2Nqb032vHGNLVDHfOXO5MH7JoQ8xj09dDMz7El7jNsXl27fFH5nkI8iq%2FUz%2FfU5SFbFMab11scpjktSzLM9mLdx4Kpy7k0VfFJgErMojGggWzDlkpZFQWUHujd4yN0t4Z5yw7fnkgG0AyVgER7RhZTcy4WIH1G%2BYAtEVQa9mx9xxV9Xv6PHwMYxezuIdUt32awpTrIS1KneLSvI46bkEWX7HukoLi3z9Of0WJZPIhAQAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
let central_park = dynamic({"type":"Polygon","coordinates":[[[-73.9495,40.7969],[-73.95807266235352,40.80068603561921],[-73.98201942443848,40.76825672305777],[-73.97317886352539,40.76455136505513],[-73.9495,40.7969]]]});
print geo_closest_point_on_polygon(-73.9839, 40.7705, central_park)
```

**Output**

|print_0|
|---|
|{"type": "Point","coordinates": [-73.981205580153926, 40.769359452843211] }|


The following example returns a null result because of the invalid coordinate input.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAzWLwQrDIBBEf0X2pODBHHoJ9B96F5FgJAjbXVFzkJJ%2F75aS0xvmzdRWaKiW%2B4lDPVXpdCLqI3NMyD33ESvLIjJJwHkw6YdzdrH7pO1dkv7AmDXDquD192AhMbe90DZyF%2BG9d9YF6xf53RT8yhAuY8wX36BVQYUAAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
print result = isnull(geo_closest_point_on_polygon(500,1,dynamic({"type": "Polygon","coordinates": [[[0,0],[10,10],[10,1],[0,0]]]})))
```

**Output**

| result |
|--------|
| true   |

The following example returns a null result because of the invalid polygon input.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA02KMQoDIRBFryJTKUyhbWDvkF5EFlcWwcyI4xYScvcY0mz1H%2B%2F91gsN1bNcdahNFaGrVn1mjqmyZBmx8XpEpgV1nkzaocNj0v4qSb9hzJbhoeD5r4CQmPtRaB9ZVvDeW7QBvbPo7vuzIXyMMV96app8hAAAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
print result = isnull(geo_closest_point_on_polygon(1,1,dynamic({"type": "Polygon","coordinates": [[[0,0],[10,10],[10,10],[0,0]]]})))
```

**Output**

| result |
|--------|
| true   |
