---
title:  geo_closest_point_on_line()
description: Learn how to use the geo_closest_point_on_line() function to calculate a point on a line or a multiline, which is closest to a given point on Earth.
ms.reviewer: mbrichko
ms.topic: reference
ms.date: 04/09/2025
---
# geo_closest_point_on_line()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculates a point on a line or a multiline, which is closest to a given point on Earth.

## Syntax

`geo_closest_point_on_line(`*longitude*`,`*latitude*`,`*lineString*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *longitude* | `real` |  :heavy_check_mark: | The geospatial coordinate longitude value in degrees. A valid value is in the range [-180, +180].|
| *latitude* | `real` |  :heavy_check_mark: | The geospatial coordinate latitude value in degrees. A valid value is in the range [-90, +90].|
| *lineString* | `dynamic` |  :heavy_check_mark: | A line or multiline in the [GeoJSON format](https://tools.ietf.org/html/rfc7946).|

## Returns

A point in [GeoJSON Format](https://tools.ietf.org/html/rfc7946) and of a [dynamic](scalar-data-types/dynamic.md) data type on a line or multiline which is the closest to a given point on Earth. If the coordinate or lineString are invalid, the query produces a null result.

> [!NOTE]
>
> * The geospatial coordinates are interpreted as represented by the [WGS-84](https://earth-info.nga.mil/index.php?dir=wgs84&action=wgs84) coordinate reference system.
> * The [geodetic datum](https://en.wikipedia.org/wiki/Geodetic_datum) used to measure distance on Earth is a sphere. Line edges are [geodesics](https://en.wikipedia.org/wiki/Geodesic) on the sphere.
> * If input line edges are straight cartesian lines, consider using [geo_line_densify()](geo-line-densify-function.md) in order to convert planar edges to geodesics.
> * In order to calculate a distance between the closest point on a line or multiline to a given point, use [geo_distance_point_to_line()](geo-distance-point-to-line-function.md)

### LineString definition and constraints

dynamic({"type": "LineString","coordinates": [[lng_1,lat_1], [lng_2,lat_2],..., [lng_N,lat_N]]})

dynamic({"type": "MultiLineString","coordinates": [[line_1, line_2, ..., line_N]]})

* LineString coordinates array must contain at least two entries.
* Coordinates [longitude, latitude] must be valid where longitude is a real number in the range [-180, +180] and latitude is a real number in the range [-90, +90].
* Edge length must be less than 180 degrees. The shortest edge between the two vertices is chosen.

> [!TIP]
>
> * Using literal LineString or a MultiLineString may result in better performance.

## Examples

The following example finds the point on a road which is the closest to North Las Vegas Airport.

:::image type="content" source="media/geo-distance-point-to-line-function/distance-point-to-line.png" alt-text="Screenshot of a map showing the distance between North Las Vegas Airport and a specific road.":::

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1XPS2rDMBCA4asIrRJwgzQvaQK9QXddBmOCY4IhtUzsTQi5e53KyHSjxafh12i898NsxrScTRqaWz905tNcu9S0tzR109z8u9t9eM8HryrAlUE5gHfktTKXx3D%2B6dvd09j5MXb2aL%2BW8e95yV9tZduU7pd%2BOM%2FdZI%2BnU654xsjVOwLqletqdRTV7M6hSHFywPB2r0DBbY7M8c9jZMDNyQXJvuSpOJNI7gSiuM2LEPrsgjEWjwhRs7NzobiC%2BLUjAcue4IDyv3xAQi0OvCy6vovCdf3a738BdPjpOIABAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
print point_on_line = geo_closest_point_on_line(-115.199625, 36.210419, dynamic({ "type":"LineString","coordinates":[[-115.115385,36.229195],[-115.136995,36.200366],[-115.140252,36.192470],[-115.143558,36.188523],[-115.144076,36.181954],[-115.154662,36.174483],[-115.166431,36.176388],[-115.183289,36.175007],[-115.192612,36.176736],[-115.202485,36.173439],[-115.225355,36.174365]]}))
```

**Output**

| point_on_line |
|--------------------|
| { "type": "Point", "coordinates": [ -115.192612, 36.176736]} |

The following example returns a null result because of the invalid LineString input.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShKLS7NKVGwVcgszivNydFIT82PT87JL04tLokvyAeqiM%2FPi8%2FJzEvVMNQx1FFIqcxLzM1M1qhWUCqpLEhVslLyAcoFlwDNSleq1dTUBABo%2F2JEVgAAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
print isnull(geo_closest_point_on_line(1,1, dynamic({ "type":"LineString"})))
```

**Output**

| result |
|--------|
|  true  |

The following example returns a null result because of the invalid coordinate input.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAw3MPQrEIBBA4asMUylMkZ8usDfYbksRCWYIgjuKTooQ9u5r%2FT5ebUkUGvcrK7wgdblyNieXEHPp3DXUMkQoEnISNus0EawExy37N0XzAOpdGTd8j%2FzRsTuRMJbSjiS7csfNuZlmT26hxfuftfYPobhZWXUAAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
print result = isnull(geo_closest_point_on_line(300, 3, dynamic({ "type":"LineString","coordinates":[[1,1],[2,2]]})))
```

**Output**

| result |
|--------|
|  true  |
