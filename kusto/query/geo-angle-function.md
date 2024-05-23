---
title:  geo_angle()
description: Learn how to use the geo_angle() function to calculate the angle between two lines on Earth.
ms.reviewer: mbrichko
ms.topic: reference
ms.date: 01/05/2024
---
# geo_angle()

Calculates clockwise angle in radians between two lines on Earth. The first line is [point1, point2] and the second line is [point2, point3].

## Syntax

`geo_angle(`*p1_longitude*`,`*p1_latitude*`,`*p2_longitude*`,`*p2_latitude*`,`*p3_longitude*`,`*p3_latitude*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*p1_longitude*| `real` |  :heavy_check_mark: | The longitude value in degrees of the first geospatial coordinate. A valid value is in the range [-180, +180].|
|*p1_latitude*| `real` |  :heavy_check_mark: | The latitude value in degrees of the first geospatial coordinate. A valid value is in the range [-90, +90].|
|*p2_longitude*| `real` |  :heavy_check_mark: | The longitude value in degrees of the second geospatial coordinate. A valid value is in the range [-180, +180].|
|*p2_latitude*| `real` |  :heavy_check_mark: | The latitude value in degrees of the second geospatial coordinate. A valid value is in the range [-90, +90].|
|*p3_longitude*| `real` |  :heavy_check_mark: | The longitude value in degrees of the second geospatial coordinate. A valid value is in the range [-180, +180].|
|*p3_latitude*| `real` |  :heavy_check_mark: | The latitude value in degrees of the second geospatial coordinate. A valid value is in the range [-90, +90].|

## Returns

An angle in radians in range [0, 2pi) between two lines [p1, p2] and [p2, p3]. The angle is measured CW from the first line to the Second line.

> [!NOTE]
>
> * The geospatial coordinates are interpreted as represented by the [WGS-84](https://earth-info.nga.mil/index.php?dir=wgs84&action=wgs84) coordinate reference system.
> * The [geodetic datum](https://en.wikipedia.org/wiki/Geodetic_datum) used to measure distance on Earth is a sphere. Line edges are [geodesics](https://en.wikipedia.org/wiki/Geodesic) on the sphere.
> * If the coordinates are invalid, the query will produce a null result.
> * If point1 is equal to point2, the query will produce a null result.
> * If point2 is equal to point3, the query will produce a null result.
> * If point1 and point2 are antipodal, the query will produce a null result.
> * If point2 and point3 are antipodal, the query will produce a null result.

## Examples

The following example calculates the angle in radians.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUjMS89Jjc%2FMiy9KTMlMzCtWsFVIT82PBwtrGOgoGAKxgY6pjoKxjq6hgSYAgS0UoTUAAAA%3D" target="_blank">Run the query</a>
```kusto
print angle_in_radians = geo_angle(0, 10, 0,5, 3,-10)
```

**Output**

|angle_in_radians|
|---|
|2.94493843406882|

The following example calculates the angle in degrees.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVFIzEvPSY3PzIsvSkzJTMwrVrBVSE%2FNjwcLaxjoKBgCsYGOqY6CsY6uoYGmNVdBUWYekraU1PSi1FSQNihLA91ETQCHVNd5ZwAAAA%3D%3D" target="_blank">Run the query</a>
```kusto
let angle_in_radians = geo_angle(0, 10, 0,5, 3,-10);
print angle_in_degrees = degrees(angle_in_radians)
```

**Output**

|angle_in_degrees|
|---|
|168.732543198009|

The following example returns null because 1st point equals to 2nd point.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUcgsjs8rzclRsAWyQAyN9NT8%2BMS89JxUDQMdBUMghlLGOgq6hgaamgD0cBDLNwAAAA%3D%3D" target="_blank">Run the query</a>
```kusto
print is_null = isnull(geo_angle(0, 10, 0, 10, 3, -10))
```

**Output**

|is_null|
|---|
|True|

