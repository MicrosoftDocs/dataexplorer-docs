---
title:  geo_azimuth()
description: Learn how to use the geo_azimuth() function to calculate the angle between the true north and a line on Earth.
ms.reviewer: mbrichko
ms.topic: reference
ms.date: 01/05/2024
---
# geo_azimuth()

Calculates clockwise angle in radians between the line from point1 to true north and a line from point1 to point2 on Earth.

## Syntax

`geo_azimuth(`*p1_longitude*`,`*p1_latitude*`,`*p2_longitude*`,`*p2_latitude*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*p1_longitude*| real | &check; | The longitude value in degrees of the first geospatial coordinate. A valid value is in the range [-180, +180].|
|*p1_latitude*| real | &check; | The latitude value in degrees of the first geospatial coordinate. A valid value is in the range [-90, +90].|
|*p2_longitude*| real | &check; | The longitude value in degrees of the second geospatial coordinate. A valid value is in the range [-180, +180].|
|*p2_latitude*| real | &check; | The latitude value in degrees of the second geospatial coordinate. A valid value is in the range [-90, +90].|

## Returns

An angle in radians between the line from point p1 to true north and line [p1, p2]. The angle is measured CW.

> [!NOTE]
>
> * The geospatial coordinates are interpreted as represented by the [WGS-84](https://earth-info.nga.mil/index.php?dir=wgs84&action=wgs84) coordinate reference system.
> * The [geodetic datum](https://en.wikipedia.org/wiki/Geodetic_datum) used to measure distance on Earth is a sphere. Line edges are [geodesics](https://en.wikipedia.org/wiki/Geodesic) on the sphere.
> * Azimuth 0 points north. Azimuth Pi/2 points east. Azimuth Pi points south. Azimuth 3Pi/2 points west.
> * If the coordinates are invalid, the query will produce a null result.
> * If point1 is equal to point2, the query will produce a null result.
> * If point1 and point2 are antipodal, the query will produce a null result.

## Examples

The following example calculates azimuth in radians.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUisyswtLcmIz8yLL0pMyUzMK1awVUhPzY%2BHSmiY6igYGkCwromBJgCWKj32NgAAAA%3D%3D" target="_blank">Run the query</a>
```kusto
print azimuth_in_radians = geo_azimuth(5, 10, 10, -40)
```

**Output**

|azimuth_in_radians|
|---|
|3.05459939796449|


The following example calculates azimuth in degrees.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVFIrMrMLS3JiM%2FMiy9KTMlMzCtWsFVIT82Ph0pomOooGBpAsK6JgaY1L1dBUWYeisaU1PSi1FSQRihLA9NUTWsA0SMJ2G4AAAA%3D" target="_blank">Run the query</a>
```kusto
let azimuth_in_radians = geo_azimuth(5, 10, 10, -40);
print azimuth_in_degrees = degrees(azimuth_in_radians);
```

**Output**

|azimuth_in_degrees|
|---|
|175.015653606568|


The following example returns null because 1st point equals to 2nd point.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUcgsjs8rzclRsAWyQAyN9NT8%2BMSqzNzSkgwNUx0FQwMdBTClqQkAkB%2FPgDEAAAA%3D" target="_blank">Run the query</a>
```kusto
print is_null = isnull(geo_azimuth(5, 10, 5, 10))
```

**Output**

|is_null|
|---|
|True|