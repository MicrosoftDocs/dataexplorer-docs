---
title: geo_distance_point_to_line() - Azure Data Explorer
description: This article describes geo_distance_point_to_line() in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mbrichko
ms.service: data-explorer
ms.topic: reference
ms.date: 03/11/2020
---
# geo_distance_point_to_line()

Calculates the shortest distance between a coordinate and a line on Earth.

## Syntax

`geo_distance_point_to_line(`*longitude*`, `*latitude*`, `*lineString*`)`

## Arguments

* *longitude*: Geospatial coordinate longitude value in degrees. Valid value is a real number and in the range [-180, +180].
* *latitude*: Geospatial coordinate latitude value in degrees. Valid value is a real number and in the range [-90, +90].
* *lineString*: Line in the [GeoJSON format](https://tools.ietf.org/html/rfc7946) and of a [dynamic](./scalar-data-types/dynamic.md) data type.

## Returns

The shortest distance, in meters, between a coordinate and a line on Earth. If the coordinate or lineString are invalid, the query will produce a null result.

> [!NOTE]
> * The geospatial coordinates are interpreted as represented by the [WGS-84](https://earth-info.nga.mil/GandG/update/index.php?action=home) coordinate reference system.
> * The [geodetic datum](https://en.wikipedia.org/wiki/Geodetic_datum) used to measure distance on Earth is a sphere. Line edges are [geodesics](https://en.wikipedia.org/wiki/Geodesic) on the sphere.
> * If input line edges are straight cartesian lines, consider using [geo_line_densify()](geo-line-densify-function.md) in order to convert planar edges to geodesics.

**LineString definition and constraints**

dynamic({"type": "LineString","coordinates": [ [lng_1,lat_1], [lng_2,lat_2] ,..., [lng_N,lat_N] ]})

* LineString coordinates array must contain at least two entries.
* Coordinates [longitude,latitude] must be valid where longitude is a real number in the range [-180, +180] and latitude is a real number in the range [-90, +90].
* Edge length must be less than 180 degrees. The shortest edge between the two vertices will be chosen.

> [!TIP]
> * For better performance, use literal lines.
> * If you want to know the closest distance between one or more points to many lines, consider folding these lines into one multiline. See the [example](#Examples) below.

## Examples

The following example finds the shortest distance between North Las Vegas Airport and a nearby road.

:::image type="content" source="images/geo-distance-point-to-line-function/distance-point-to-line.png" alt-text="Distance between North Las Vegas Airport and road":::

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
print distance_in_meters = geo_distance_point_to_line(-115.199625, 36.210419, dynamic({ "type":"LineString","coordinates":[[-115.115385,36.229195],[-115.136995,36.200366],[-115.140252,36.192470],[-115.143558,36.188523],[-115.144076,36.181954],[-115.154662,36.174483],[-115.166431,36.176388],[-115.183289,36.175007],[-115.192612,36.176736],[-115.202485,36.173439],[-115.225355,36.174365]]}))
```

| distance_in_meters |
|--------------------|
| 3797.88887253334   |

Storm events in south coast US. The events are filtered by a maximum distance of 5 km from the defined shore line.

:::image type="content" source="images/geo-distance-point-to-line-function/us-south-coast-storm-events.png" alt-text="Storm events in the US south coast":::

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
let southCoast = dynamic({"type":"LineString","coordinates":[[-97.18505859374999,25.997549919572112],[-97.58056640625,26.96124577052697],[-97.119140625,27.955591004642553],[-94.04296874999999,29.726222319395504],[-92.98828125,29.82158272057499],[-89.18701171875,29.11377539511439],[-89.384765625,30.315987718557867],[-87.5830078125,30.221101852485987],[-86.484375,30.4297295750316],[-85.1220703125,29.6880527498568],[-84.00146484374999,30.14512718337613],[-82.6611328125,28.806173508854776],[-82.81494140625,28.033197847676377],[-82.177734375,26.52956523826758],[-80.9912109375,25.20494115356912]]});
StormEvents
| project BeginLon, BeginLat, EventType
| where geo_distance_point_to_line(BeginLon, BeginLat, southCoast) < 5000
| render scatterchart with (kind=map) // map rendering available in Kusto Explorer desktop
```

NY taxi pickups. Pickups are filtered by maximum distance of 0.1 m from the defined line.

:::image type="content" source="images/geo-distance-point-to-line-function/park-ave-ny-road.png" alt-text="Storm events in US south coast":::

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
nyc_taxi
| project pickup_longitude, pickup_latitude
| where geo_distance_point_to_line(pickup_longitude, pickup_latitude, dynamic({"type":"LineString","coordinates":[[-73.97583961486816,40.75486445336327],[-73.95215034484863,40.78743027428638]]})) <= 0.1
| take 50
| render scatterchart with (kind=map) // map rendering available in Kusto Explorer desktop
```

The following example folds many lines into one multiline and queries this multiline. The query finds all taxi pickups that happened 10km away from all roads in Manhattan.

:::image type="content" source="images/geo-distance-point-to-line-function/lines-folding.png" alt-text="Lines folding":::

```kusto
let ManhattanRoads =
    datatable(features:dynamic)
    [
        dynamic({"type":"Feature","properties":{"Label":"145thStreetBrg"},"geometry":{"type":"MultiLineString","coordinates":[[[-73.9322259,40.8194635],[-73.9323259,40.8194743],[-73.9323973,40.8194779]]]}}),
        dynamic({"type":"Feature","properties":{"Label":"W120thSt"},"geometry":{"type":"MultiLineString","coordinates":[[[-73.9619541,40.8104844],[-73.9621542,40.8105725],[-73.9630542,40.8109455],[-73.9635902,40.8111714],[-73.9639492,40.8113174],[-73.9640502,40.8113705]]]}}),
        dynamic({"type":"Feature","properties":{"Label":"1stAve"},"geometry":{"type":"MultiLineString","coordinates":[[[-73.9704124,40.748033],[-73.9702043,40.7480906],[-73.9696892,40.7487346],[-73.9695012,40.7491976],[-73.9694522,40.7493196]],[[-73.9699932,40.7488636],[-73.9694522,40.7493196]],[[-73.9694522,40.7493196],[-73.9693113,40.7494946],[-73.9688832,40.7501056],[-73.9686562,40.7504196],[-73.9684231,40.7507476],[-73.9679832,40.7513586],[-73.9678702,40.7514986]],[[-73.9676833,40.7520426],[-73.9675462,40.7522286],[-73.9673532,40.7524976],[-73.9672892,40.7525906],[-73.9672122,40.7526806]]]}})
        // ... more roads ...
    ];
let allRoads=toscalar(
    ManhattanRoads
    | project road_coordinates=features.geometry.coordinates
    | summarize make_list(road_coordinates)
    | project multipolygon = pack("type","MultiLineString", "coordinates", list_road_coordinates));
nyc_taxi
| project pickup_longitude, pickup_latitude
| where pickup_longitude != 0 and pickup_latitude != 0
| where geo_distance_point_to_line(pickup_longitude, pickup_latitude, todynamic(allRoads)) > 10000
| take 10
| render scatterchart with (kind=map)
```

The following example will return a null result because of the invalid LineString input.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
print distance_in_meters = geo_distance_point_to_line(1,1, dynamic({ "type":"LineString"}))
```

| distance_in_meters |
|--------------------|
|                    |

The following example will return a null result because of the invalid coordinate input.

```kusto
print distance_in_meters = geo_distance_point_to_line(300, 3, dynamic({ "type":"LineString","coordinates":[[1,1],[2,2]]}))
```

| distance_in_meters |
|--------------------|
|                    |
