---
title: Geospatial joins
description: Learn about geospatial joins between tables
ms.reviewer: mbrichko
ms.topic: reference
ms.date: 03/20/2025
---

# Geospatial joins

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Kusto Query Language (KQL) provides tools for geospatial joins.

The following tools and capabilities are useful:

* Converting points (longitude, latitude) to one of the supported geo hashes [S2](geo-point-to-s2cell-function.md), [H3](geo-point-to-h3cell-function.md) or [Geohash](geo-point-to-geohash-function.md). Geo hash can be used as a join key. Two nearby points are converted to the same hash value or they are neighbors, which can be accounted for as well. Learn more about different [geo hash algorithms](geospatial-grid-systems.md). See examples below.


* Buffer capabilities [geo_point_buffer()](geo-point-buffer-function.md), [geo_polygon_buffer()](geo-polygon-buffer-function.md), and [geo_line_buffer()](geo-line-buffer-function.md) can help geospatial conditional joins whenever match is a proximity condition. See example below.


* Polygon\Line lookup plugin capabilities [geo_polygon_lookup()](geo-polygon-lookup-plugin.md) and [geo_line_lookup()](geo-line-lookup-plugin.md) allow easy classification of locations to their respective polygons\lines based on containment and\or proximity.


* Shape covering functions [geo-polygon-to-s2cells()](geo-polygon-to-s2cells-function.md) and [geo-line-to-s2cells()](geo-line-to-s2cells-function.md) are advanced shape covering utilities that can transform shapes to a collection of hashes that can be persisted and used for joins and indexing.

> [!TIP]
>
> * If there are too many nearby locations, use one of the supported geo hashes [S2](geo-point-to-s2cell-function.md), [H3](geo-point-to-h3cell-function.md) or [Geohash](geo-point-to-geohash-function.md) to aggregate near by locations.
>
> * Read more about [join operator](join-operator.md) and its flavors.

## Examples

The following example illustrates join on locations using [S2](geo-point-to-s2cell-function.md).

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA61SS27bMBDd6xQDr2xAssSvKAdGTpATFIVASxObCU26JJWmRQ9f2mkiZRmgnBVn%2BH4DWkxg%2FaCT8S4S2MOoU66DxbXTZ9xBTMG4Y5kfuaNJ05hbAbXNjYyZ75viWwH5rPSqhKrZEsoZa1TTSqlaTmhbgiBbQQgRihMmieRt%2BYY4zAgqBWGccKFayj4QslFcybYRSvyDDAsIl7JjnWQtlXIW6USX%2B0S%2Bi4yrkuQqvt8VdhmZfopsxq8HJkv7UpFGUMU7SRZemFINVYy%2Bq0faP3njeosvaLMBSu%2BgruHBBwR98FOC6xhu47iDU0qXuKtrizq47dkMwUf%2FmLaDP9foqinWz1NMvv4xYfhVH9FXlwxPVfJVpANaWz1ObrjGvX8x%2BHOvf08Bq2vqCl8vNquGYv4DxR%2FA14RuhJOOp%2BwuE%2FY3wj75%2Fo1w%2FbGceS3l51ibzHNL8Wwy1R6McxhgvVj8f9LZgHc3iix4Cf4JhwTXr1uCGf8CcjE1xt4CAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
let locations1 = datatable(name: string, longitude: real, latitude: real)
[
    "a", -0.12433080766874127, 51.51115841361647,
    "b", -0.12432651341458723, 51.511160848670585,
    "c", -0.12432466939637266, 51.51115959669167,
    "d", 1,                    1,
];
let locations2 = datatable(id: string, longitude: real, latitude: real)
[
    "1", -0.12432668105284961, 51.51115938802832
];
let s2_join_level = 22; // More about join levels: https://learn.microsoft.com/en-us/kusto/query/geo-point-to-s2cell-function?view=azure-data-explorer
locations1
| extend hash = geo_point_to_s2cell(longitude, latitude, s2_join_level)
| join kind = inner (locations2 | extend hash = geo_point_to_s2cell(longitude, latitude, s2_join_level)) on hash
| project name, id  
```

**Output**

|name|id|
|-|-|
|a|1|
|b|1|
|c|1|

The following example illustrates join on locations using [H3](geo-point-to-h3cell-function.md) while accounting for a case where two nearby locations may be neighbors.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA5VT246bMBB95yusfSISBIzBOImifkG%2FoKqQA07wxrGzxqSbXv69g0mA7Uu18MT4XObMGCUcUqbmThrdYbRHDXfwHpQINb%2BILeqclfoUAUifpOsbKFnBFRSAM3%2Bvgm8BgueFv0QoTtc4ywlJWVpSysocZ2WECrwuMMYFyzGhmOZlNDIOMyOjBSY5zgtWZmRi0JTljJZpwYoHpV5Qcko3ZENJmVE6m2yKDdQxfZo0wMARjoLvu0AtM2cfMsvm84nxsn%2FKcFpkLN9QvGiGMJZmjGRPd2eqy71qedeCe6j0aWHxVP%2Fl1Qd0Szy0UuImFBBwvkNJgr4aKxA%2FmN6hVyM18sfdFrXOXbttkijBrV5fZG1NZ45uXZtLInTcd8m575xJ3nph78lJmPgKdBc7E7ekFkrFx17Xw3C%2B3KT4sec%2FeyviYUaxeL8qcLX%2FtgZNgU7ldSoIN%2BoMwXyk6GOE1c7zubX8XtVGwybCK6%2FPla%2BED%2Bwq8pqjVKWFPLUHY7vpeBX8gWFOVzf4jcS7E7pBj4bmGYfTJucdrgB%2FuQ2B%2BJPiDHL3qzDHcLwBA8QP9iwBskdSa2FROGafro%2F%2F%2FKz3yPmf%2F4gz2h9DM43snITNoOHPjJBsFnd0Vv8Lpkv0ydIDAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
let locations1 = datatable(name: string, longitude: real, latitude: real)
[
    "a", -0.12433080766874127, 51.51115841361647,
    "b", -0.12432651341458723, 51.511160848670585,
    "c", -0.12432466939637266, 51.51115959669167,
    "d", 1,                    1,
];
let locations2 = datatable(id: string, longitude: real, latitude: real)
[
    "1", -0.12432668105284961, 51.51115938802832
];
let to_my_hash = (lng: real, lat: real)
{
    let h3_hash_level = 14; // More about join levels: https://learn.microsoft.com/en-us/kusto/query/geo-point-to-h3cell-function?view=azure-data-explorer
    let h3_hash = geo_point_to_h3cell(lng, lat, h3_hash_level);
    array_concat(pack_array(h3_hash), geo_h3cell_neighbors(h3_hash))
};
locations1
| extend hash = to_my_hash(longitude, latitude)
| mv-expand hash to typeof(string)
| join kind = inner (
    locations2
    | extend hash = to_my_hash(longitude, latitude)
    | mv-expand hash to typeof(string))
    on hash
| distinct name, id, longitude, latitude
```

**Output**

|name|id|longitude|latitude|
|-|-|-|-|
|a|1|-0.124330807668741|51.5111584136165|
|b|1|-0.124330807668741|51.5111584136165|
|c|1|-0.124324669396373|51.5111595966917|


The following example illustrates join of locations from locations1 table with locations from locations2 table if the points from locations1 are within 300 meters of points from locations2 table.


:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA52STUvDQBCG7%2FkVQ08thHa%2Fk7V4EBGPepdStskkxqa7ZbPxA%2FzxbtraKCiIO6cd5pl552VaDNC6woTG2Y7CJZQmxNi0OLVmhxfQBd%2FYOo1Ftm5CX8aUR9PGRGTG%2Fyx5SCC%2ByR2DGxu8sQVOUiBzQmSeayGFJDSjijOagqRzSRjPFVOaKpmL9DeWaMVkRgRlESBSq%2FTA8lwKzrKMEMpP7K1HtC9N8Qj3xm%2FPONeSEkUEE0SoLDvMFgMopJKx88Cvlkn71Qb2zYam%2FJcJVx6tOcngVGoeVdCMS0Z49umAjsHibjnXIlkl74CvAW0Jm76q0EcVNbr13jU2rI%2Bp6V%2B7pcAJGYbT2RIWC7iO8gKCAW%2FKpu%2FAVUMB7DCg76DybgdRc4E2%2Fs9GJONhDNqeTdsPTY6i2rfa2XXr3LbfT0frvng0upOeNprFNnvvnrAIMFxXCk35I%2FABkBiw35YCAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
let locations1 = datatable(name: string, longitude: real, latitude: real)
[
    "O2 Entrance",    0.005889454501716321,  51.50238626916584,
    "O2 Entrance",    0.0009625704125020596, 51.50385432770013,
    "Greenwich Park", 0.0009395106042404677, 51.47700456557013,
];
let locations2 = datatable(id: string, longitude: real, latitude: real)
[
    "O2 Arena", 0.003159306017352037, 51.502929224128394
]
| extend buffer = geo_point_buffer(0.003159306017352037, 51.502929224128394, 300, 0.1); // Create a radius of 300 meters from O2 center location
locations1
| evaluate geo_polygon_lookup(locations2, longitude, latitude, buffer)
| project name, id, longitude, latitude
```

**Output**

|name|id|longitude|latitude|
|-|-|-|-|
|O2 Entrance|O2 Arena|0.00096257041250206|51.5038543277001|
|O2 Entrance|O2 Arena|0.00588945450171632|51.5023862691658|