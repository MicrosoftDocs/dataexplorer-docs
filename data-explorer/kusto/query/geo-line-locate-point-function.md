---
title:  geo_line_locate_point()
description: Learn how to use the geo_line_locate_point() function to calculate fraction value as a ratio of a line length from line start till a point on a line which is closest to a given point and a whole line length on Earth.
ms.reviewer: mbrichko
ms.topic: reference
ms.date: 04/09/2025
---
# geo_line_locate_point()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculates fraction value as a ratio of a line length from line start till a point on a line which is closest to a given point and a whole line length on Earth.

## Syntax

`geo_line_locate_point(`*lineString*`, `*longitude*`,`*latitude*`,`[ *use_spheroid* ]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *lineString* | `dynamic` |  :heavy_check_mark: | A line in the [GeoJSON format](https://tools.ietf.org/html/rfc7946).|
| *longitude* | `real` |  :heavy_check_mark: | The geospatial coordinate longitude value in degrees. A valid value is in the range [-180, +180].|
| *latitude* | `real` |  :heavy_check_mark: | The geospatial coordinate latitude value in degrees. A valid value is in the range [-90, +90].|
| *use_spheroid* | `bool` | | If `false` will use a sphere as [geodetic datum](https://en.wikipedia.org/wiki/Geodetic_datum) for measuring distance. If `true` will measure distance using spheroid. If unspecified, the default value `false` is used.

## Returns

Line fraction value between 0 and 1 (0 - 100%) as a ratio of a line from start till a point on a line which is closest to a given point and a whole line on Earth. If the line or coordinate value is invalid, the query produces a null result.

> [!NOTE]
>
> * The geospatial coordinates are interpreted as represented by the [WGS-84](https://earth-info.nga.mil/index.php?dir=wgs84&action=wgs84) coordinate reference system.
> * Line segments are [geodesics](https://en.wikipedia.org/wiki/Geodesic) on the sphere, if 'use_spheroid' = false. If 'use_spheroid' = true, line segments will be geodesics on spheroid. Most applications should measure distance using sphere which is more performant
> * If input line edges are straight cartesian lines, consider using [geo_line_densify()](geo-line-densify-function.md) in order to convert planar edges to geodesics.
> * The input shouldn't contain more than a single line string.
> * If the input line string has more than single point on the line at equal distances from the input point, it isn't guaranteed which one is selected.
> * In order to calculate a point at fraction on a line use [geo_line_interpolate_point()](geo-line-interpolate-point-function.md)

**LineString definition and constraints**

dynamic({"type": "LineString","coordinates": [[lng_1,lat_1], [lng_2,lat_2], ..., [lng_N,lat_N]]})

* LineString coordinates array must contain at least two entries.
* Coordinates [longitude, latitude] must be valid where longitude is a real number in the range [-180, +180] and latitude is a real number in the range [-90, +90].
* Edge length must be less than 180 degrees. The shortest edge between the two vertices is chosen.

## Examples

The following example calculates a fraction value.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAyXNsQqDMBSF4b3Qd7hkUkjFakyM0jfo1lFEJEYJpLmSZpHSd2%2FU9ePwH6sDWOM0PGDa3Pg2KvmSsK2aNOQZ%2FRW8cQuhRCH6ybgx6A9puu4mykxWQnIKLM%2FqPGdFT%2BFkUd7FwYIzVvO%2B%2F6Xt9bLGUIDZjyoYdPFv0Tjs14NFFbPDinGQ7ELh6PDqrMgibf%2BYtZN8qAAAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
let line = dynamic({"type":"LineString","coordinates":[[-73.95796, 40.80042], [-73.97317, 40.764486]]});
print fraction = geo_line_locate_point(line, -73.965, 40.792);
```

**Output**

|fraction|
|---|
|0.25560135100307552|

The following example returns `true` because of the invalid line.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAx2MwQqAIBBEf0X2pOCla9AfdOsoIaYiC7YrZYeI%2Fr0lGBjm8Zh2IHWFp99C8hUpq0kWXbXqkvknvnIMPfvGoup0U9gx6gf63TKMMIuydLkpYCEyHwlJ9BNG5warhnV9jZTEmA8EJ6jrbgAAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
print is_bad_line = isnull(geo_line_locate_point(dynamic({"type":"LineString","coordinates":[[1, 1]]}), 1, 1))
```

**Output**

|is_bad_line|
|---|
|true|