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

Consider a truck that emits telemetry of its location while it travels and we would like to know the direction.

:::image type="content" source="images/geo-azimuth-function/azimuth.png" alt-text="Azimuth between two consecutive locations.":::

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA4WUyY7bMAyG7wHyDsKc7MJJRS2UlHaOvfbSAgVaFIEm0SRundhwlE7Xdy%2B9JV2M2AsgUz8%2FUaTFIkS2C3G9zeuwiXl5ZPcs8d%2FzwznuV3XwRTqf%2FZjPGF0FSauc5qs8SV90tvzxcVCzlzTxXGRkvXtd1nG%2FeOVP8S4bFzYyEr4pzzeF8lnH7IXvwlU4fvVLt8I0bcL8Re%2FWR7ofipDE%2FEBT%2FlCtyBaar4wVx127VRr5OGz6Q7fKoEoEF2rBgZ63nK84rLRccmU1x%2FdpxhYAeqm4ROQGnVRgMiaRLFoDSuAKBUJ2GylGkFJotIQUku4WSWwuQAmDHGAKKUeQwkghHEeiQIcUVmnrQFnhHAV%2BG6nGkBokWApSEqVDUshCOoWopBYTSD2GJDdKHkophiiNVlorw6XVoCeQOIIE6xRlj6pjNfYbF9hUS0lAM5XLUSTX5GsBrELbI5023Opm2ziVSzuC5KgsgqJUKpA9EoAbJQXpzFQu3X9ItXRWW07uaIzsN%2B6M5ehQc2eoYjeRwMeQHMgdNRWF%2Fuv2v0SqFji0IDUiIT%2FOZz%2FZiU4je%2FjGLseO%2BdOGNTPhawzHLavq8GVNB7BpKzRMaEhrdFYfL1Yf08bpaR%2FqwPLTsYzHc1Ekg3fKPLH%2BtfdO%2FUp%2Fdri%2FOl6yC%2BW6bzkX4jWGtj%2B0rSFtcVVdfiLHK%2B8qaKZrWivU7LTxMYZ6s%2FeUgKecmlnyOaco7tnBV%2Blvoeuqd3YFAAA%3D" target="_blank">Run the query</a>
```kusto
let get_direction = (azimuth:real)
{
    let pi = pi();
    iff(azimuth < pi/2,   "North-East",
    iff(azimuth < pi,     "South-East",
    iff(azimuth < 3*pi/2, "South-West",
                          "North-West")));
};
datatable(timestamp:datetime, lng:real, lat:real)
[
    datetime(2024-01-01T00:01:53.048506Z), -115.4036607693417, 36.40551631046261,
    datetime(2024-01-01T00:02:53.048506Z), -115.3256807623232, 36.34102142760111,
    datetime(2024-01-01T00:03:53.048506Z), -115.2732290602112, 36.28458914829917,
    datetime(2024-01-01T00:04:53.048506Z), -115.2513186233914, 36.27622394664352,
    datetime(2024-01-01T00:05:53.048506Z), -115.2352055633212, 36.27545547038515,
    datetime(2024-01-01T00:06:53.048506Z), -115.1894341934856, 36.28266934431671,
    datetime(2024-01-01T00:06:53.048506Z), -115.1054318118468, 36.28957085435267,
    datetime(2024-01-01T00:08:53.048506Z), -115.0648614339413, 36.28110743285072,
    datetime(2024-01-01T00:09:53.048506Z), -114.9858032867736, 36.29780696509714,
    datetime(2024-01-01T00:10:53.048506Z), -114.9016966527561, 36.36556196813566,
]
| sort by timestamp asc 
| extend prev_lng = prev(lng), prev_lat = prev(lat)
| where isnotnull(prev_lng) and isnotnull(prev_lat)
| extend direction = get_direction(geo_azimuth(prev_lng, prev_lat, lng, lat))
| project direction, lng, lat
| render scatterchart with (kind = map)
```

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