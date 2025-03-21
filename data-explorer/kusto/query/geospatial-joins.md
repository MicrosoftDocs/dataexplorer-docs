---
title: Geospatial joins
description: Learn about geospatial joins between tables
ms.reviewer: mbrichko
ms.topic: reference
ms.date: 03/20/2025
---

# Geospatial Joins

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
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA62S3W7jIBCF7%2F0Uo14lkh2bX%2BNU0T7BPsGqiog9SWgJZAF3u1UfviTZrd3LSoUrBr5zOAMWE1jf62S8iwQ2MOiU587iwukTriGmYNyhzIfcwaRxyKWA2uZCZqb1svhVQB53%2Bq6EqlkRyhlrVNNKqVpOaFuCICtBCBGKEyaJ5G15I3YTQaUgjBMuVEvZByEbxZVsG6HEP6SfIVzKjnWStVTKyaQTXa4TmU0e7gs7T0k%2FpTTD1zOS%2BY2lIo2gineSzOyZUg1VjP53f%2FTGbS0%2Bo83ulN5DXcNPHxD0zo%2B3bbhuxzUcUzrHdV1b1MGtTqYPPvp9WvX%2BVKOrxlg%2FjTH5%2BveI4W99QF%2BdM56q5KtIe7S22o%2Buv2T98Wzwz0a%2FjgGrS%2BQKX842u4ZievPiDfAloRvgqOMx3y4Lbq%2BC2%2BS3N8HFR2emnpSzTMssco3wZLLOBoxzGGAxa%2Fl3mCzBuyuf3c7BP2Kf4PJJSzDDO%2B6FSg%2FIAgAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
let locations1 = datatable(name: string, longitude: real, latitude: real)
[
    "a", -0.12433080766874127, 51.51115841361647,
    "b", -0.12432651341458723, 51.511160848670585,
    "c", -0.12432466939637266, 51.51115959669167,
];
let locations2 = datatable(id: string, longitude: real, latitude: real)
[
    "1", -0.12432668105284961, 51.51115938802832
];
let join_level = 22; // More about join levels: https://learn.microsoft.com/en-us/kusto/query/geo-point-to-s2cell-function?view=azure-data-explorer
locations1
| extend hash = geo_point_to_s2cell(longitude, latitude, join_level)
| join kind = inner (locations2 | extend hash = geo_point_to_s2cell(longitude, latitude, join_level)) on hash
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
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA5VT27KbIBR9z1cw58nMaBRBxGQy%2FYJ%2BQafjECVKg2AB05Ne%2Fr2oidqnztEnN%2Buy194ouQNSV8wJrSwEZ1Az59%2BL5IFiHT8C64xQTehBqhFuqH3JcCZ9wXPW7%2F3uyw745429hSBKDjDFCCU0yQmhOYZpHoIMHjIIYUYxRAQSnIcz47IyUpJBhCHOaJ6ihUESiinJk4xmT0q1oWBCClQQlKeErCZFVvg6JN7k62kntynTf1KK%2BuMZ4bZjQmGSpRQXBG7sEaVJSlH6cne67B5ly2zr3QOpmo3FS%2F3XpD6iv2mhSsnvXHo0xCcQx%2BCzNhywix7mYzAd2yNonevtMY4lZ0YdOlEZbfXVHSrdxVxFg41vg3U6%2Fj5w84gbrqPe013kdNSiiksZXQdVjZP5dBf8x5n9HAyPxgFF%2FL2X3tUsfT379yLlJFL6WLPIGGkKE26a358WpuKiaS%2Fa2Cd9ZpVLORiln3hmDHuUlVZ%2BYUHPqls5VWZIuErtd3%2F8cJfLu%2FsN%2BLvjqn61uc48WDa77nTv8d19zMheFKeBe%2FRcX4P5RoyQadY34SFnIJTiBgRzqOU6TZ8f9Z45%2F%2FOfcVpNx76ZWlgn%2FLLA%2BG%2BGQNSbO7uq%2FwVv%2BiEW1AMAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
let locations1 = datatable(name: string, longitude: real, latitude: real)
[
    "a", -0.12433080766874127, 51.51115841361647,
    "b", -0.12432651341458723, 51.511160848670585,
    "c", -0.12432466939637266, 51.51115959669167,
];
let locations2 = datatable(id: string, longitude: real, latitude: real)
[
    "1", -0.12432668105284961, 51.51115938802832
];
let to_my_hash = (lng: real, lat: real)
{
    let join_level = 14; // More about join levels: https://learn.microsoft.com/en-us/kusto/query/geo-point-to-h3cell-function?view=azure-data-explorer
    let hash = geo_point_to_h3cell(lng, lat, join_level);
    let neighbors = geo_h3cell_neighbors(hash);
    array_concat(pack_array(hash), neighbors)
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
|c|1|-0.124324669396373|	51.5111595966917


The following example illustrates join of locations from locations1 table with locations from locations2 table if the points from locations1 are within 300 meters of points from locations2 table.


:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA52SS0sDMRSF9%2FMrLl21ENq8M6N0ISIudS%2BlpDOZcew0KWnGB%2FjjvdPWVkFBzF3lJt%2B5J4d0LkEXSpva4HcM5lDZhLXq3NjbjbuAXYqtbwhe8k2b%2Bgpb0dkOG8ic95PsIQNcozsONz5F60s3IkCnlKo8L6SSijLDtOCMgGJTRbnINdcF0yqX5DeWFporQyXjCFBVaLJnRa6k4MZQysSRvY3O%2BZe2fIR7G9cnXBSKUU0ll1RqY%2Faz5QBKpRUqD%2FziMuu%2BxsC%2FxdBW%2FwrhKjpvjzYEU4VAF8wIxakwnwkUWBzflotCZotsNoNrlEkOLERbtf0OQg2CUti45OIO6hg2gNql87g%2FGc7ewb0m5ytY9XWNB3NoXFhuQ%2BvT8tAa%2F9UGGeYNrtkEUzl9jGHEs%2B36wdxBu3trgl92Iaz77fgc3ZeMzumQo7EJymxjeHJlguF3EWirH4EPa0OkhJYCAAA%3D" target="_blank">Run the query</a>
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
// Create a radius of 300 meters from O2 center location
| extend buffer = geo_point_buffer(0.003159306017352037, 51.502929224128394, 300, 0.1);
locations1
| evaluate geo_polygon_lookup(locations2, longitude, latitude, buffer)
| project name, id, longitude, latitude
```

**Output**

|name|id|longitude|latitude|
|-|-|-|-|
|O2 Entrance|O2 Arena|0.00096257041250206|51.5038543277001|
|O2 Entrance|O2 Arena|0.00588945450171632|51.5023862691658|