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
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA5VT246bMBB95ytG%2BwQSBIzBOImifkG%2FoKqQA05w49jUmHTTy7%2FXmFzYVaVqzZNnzjkzc8ZIbkHqhlmh1YBgBy2z7ttLHip25hsYrBHqGDuQOgo7ti5kOJMu4DjPexR8CcCdF%2FYSQ5KtUF5gnNGsIoRWBcqrGEq0KhFCJS0QJogUVTwz9k9GTkqEC1SUtMrxg0EyWlBSZSUtb5RmQSkIWeM1wVVOyLPIuly7OCL3Iq1joBj%2BcVAcfN0GculD%2FsYH0X7cBbSciVCUlTkt1gQtGsSUZjnF%2Bb261XXHhs6VDqU6LvTv0r%2B89ATtsIfWkl%2B4dARUbCFN4bM2HNhejxa%2BaaHAp4cNdNb2wyZNJWdGrc6iMXrQB7tq9DnlKhmH9DQOVqffR26u6ZHrpHd0m1iddLjhUiaHUTWTM58ugv%2FYsZ%2Bj4clkUMJfe%2BmqmvetuaacTu116mkyrzMN5keK344QbT2fGcOudaOVW0PYs%2BZU%2B0h4w0ax15ylasXFsdtrMzzSUfDHOfl4y8Fv4K%2BWqxZuDd0MDh87fG4vcuDzZZqG3fFWg732XB%2FCefcTxLt6Eg6yA6EUNxDOgz8ejr9%2BqPBM%2BF%2FxGaeVT7tOWjFY4XYC008ag2gXT%2FOp%2FheAdK1d3QMAAA%3D%3D" target="_blank">Run the query</a>
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
let to_hash = (lng: real, lat: real)
{
    let h3_hash_level = 14; // More about join levels: https://learn.microsoft.com/en-us/kusto/query/geo-point-to-h3cell-function?view=azure-data-explorer
    let h3_hash = geo_point_to_h3cell(lng, lat, h3_hash_level);
    array_concat(pack_array(h3_hash), geo_h3cell_neighbors(h3_hash))
};
locations1
| extend hash = to_hash(longitude, latitude)
| mv-expand hash to typeof(string)
| join kind = inner (
    locations2
    | extend hash = to_hash(longitude, latitude)
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
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA52STUvDQBCG7%2FkVQ08thHa%2Fk7V4EBGPepdStskkxqa7ZbPxA%2FzxbtraKCiIO6cZ5p159mVaDNC6woTG2Y7CJZQmxNi0OLVmhxfQBd%2FYOo1Ntm5CX8aSR9PGQtSM%2BSx5SCC%2ByR2DGxu8sQVOUiBzQmSeayGFJDSjijOagqRzSRjPFVOaKpmL9Dct0YrJjAjKooBIrdKDludScJZlhFB%2B0t56RPvSFI9wb%2Fz2LOdaUqKIYIIIlWWH3WIQCqlknDzoV8uk%2FWoD%2B2ZDU%2F7LhCuP1pwwOJWaRwqacckIzz4d0DFY%2FFvOtUhWyTvga0BbwqavKvSRoka33rvGhvWxNP3rtBQ4IcNyOlvCYgHXES8gGPCmbPoOXDU0wA4D%2Bg4q73YQmQu0MT8bkYyHMbA9m7Yfhhyh2rfa2XXr3LbfT0fr0hP8F69Gl2ZxzN67JywCDNeVQlP%2B2PgBZxDMbZYCAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
let locations1 = datatable(name: string, longitude: real, latitude: real)
[
    "O2 Entrance", 0.005889454501716321, 51.50238626916584,
    "O2 Entrance", 0.0009625704125020596,51.50385432770013,
    "Greenwich Park", 0.0009395106042404677, 51.47700456557013,
];
let locations2 = datatable(id: string, longitude: real, latitude: real)
[
    "O2 Arena", 0.003159306017352037, 51.502929224128394
]
| extend buffer = geo_point_buffer(0.003159306017352037, 51.502929224128394, 300, 0.1); // Create a radius of 300 meters from O2 center location
locations1
| evaluate geo_polygon_lookup(locations2, buffer, longitude, latitude)
| project name, id, longitude, latitude
```

**Output**

|name|id|longitude|latitude|
|-|-|-|-|
|O2 Entrance|O2 Arena|0.00096257041250206|51.5038543277001|
|O2 Entrance|O2 Arena|0.00588945450171632|51.5023862691658|