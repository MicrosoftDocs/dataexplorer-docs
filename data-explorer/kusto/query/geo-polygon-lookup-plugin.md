---
title:  geo_polygon_lookup plugin
description: Learn how to use the geo_polygon_lookup plugin to look up a polygon value in a lookup table.
ms.reviewer: mbrichko
ms.topic: reference
ms.date: 04/08/2025
---
# geo_polygon_lookup plugin (preview)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] 

The `geo_polygon_lookup` plugin looks up a `Polygon` value in a lookup table and returns rows with matched values. The plugin is invoked with the [`evaluate`](evaluate-operator.md) operator.

## Syntax

*T* `|` `evaluate` `geo_polygon_lookup(` *LookupTable* `,` *LookupPolygonKey* `,` *SourceLongitude* `,` *SourceLatitude* `,` [ *radius* ] `,` [ *return_unmatched* ] `,` [ *lookup_area_radius* ] `,` [ *return_lookup_key* ] `)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T* | `string` |  :heavy_check_mark: | The tabular input whose columns *SourceLongitude* and *SourceLatitude* are used for polygon matching.|
| *LookupTable* | `string` |  :heavy_check_mark: | Table or tabular expression with polygons lookup data, whose column *LookupPolygonKey* is used for polygon matching.|
| *LookupPolygonKey* | `dynamic` |  :heavy_check_mark: | The column of *LookupTable* with Polygon or multipolygon in the [GeoJSON format](https://tools.ietf.org/html/rfc7946) and of dynamic type that is matched against each *SourceLongitude*, *SourceLatitudes* values.|
| *SourceLongitude* | `real` |  :heavy_check_mark: | The column of *T* with longitude value to be looked up in *LookupTable*. Longitude value in degrees. Valid value is a real number and in the range [-180, +180].|
| *SourceLatitude* | `real` |  :heavy_check_mark: | The column of *T* with latitude value to be looked up in *LookupTable*. Latitude value in degrees. Valid value is a real number and in the range [-90, +90].|
| *radius* | `real` | | An optional radius value that defines the length from the polygon borders where the location is considered a match.|
| *return_unmatched* | `bool` | | An optional boolean flag that defines if the result should include all or only matching rows (default: `false` - only matching rows returned).|
| *lookup_area_radius* | `real` | | An optional lookup area radius distance in meters value that may help in matching locations to their respective polygons.|
| *return_lookup_key* | `bool` | | An optional boolean flag that defines if the result should include column *LookupPolygonKey* (default: `false`).|

## Returns

The `geo_polygon_lookup` plugin returns a result of join (lookup). The schema of the table is the union of the source table and the lookup table, similar to the result of the [`lookup` operator](lookup-operator.md).

Point containment in polygon is tested via [geo_point_in_polygon()](geo-point-in-polygon-function.md), or if radius is set, then [geo_distance_point_to_polygon()](geo-distance-point-to-polygon-function.md).

If the *return_unmatched* argument is set to `true`, the resulting table includes both matched and unmatched rows (filled with nulls).

If the *return_unmatched* argument is set to `false`, or omitted (the default value of `false` is used), the resulting table has as many records as matching results. This variant of lookup has better performance compared to `return_unmatched=true` execution.

Setting *lookup_area_radius* length overrides internal matching mechanism and may improve or worsen run time and\or memory consumption. It does not affect query correctness. Read more below on how to set this optional value.

> [!NOTE]
>
> * This plugin covers the scenario of classifying locations to polygons, assuming a small lookup table size, with the input table optionally having a larger size.
> * The performance of the plugin will depend on the sizes of the lookup and data source tables, the number of columns, and number of matching records.
> * The geospatial coordinates are interpreted as represented by the [WGS-84](https://earth-info.nga.mil/index.php?dir=wgs84&action=wgs84) coordinate reference system.
> * The [geodetic datum](https://en.wikipedia.org/wiki/Geodetic_datum) used for measurements on Earth is a sphere. Polygon edges are [geodesics](https://en.wikipedia.org/wiki/Geodesic) on the sphere.
> * If input polygon edges are straight cartesian lines, consider using [geo_polygon_densify()](geo-polygon-densify-function.md) to convert planar edges to geodesics.
> * Input polygons should be valid.

**Polygon definition and constraints**

dynamic({"type": "Polygon","coordinates": [ LinearRingShell, LinearRingHole_1, ..., LinearRingHole_N ]})

dynamic({"type": "MultiPolygon","coordinates": [[LinearRingShell, LinearRingHole_1, ..., LinearRingHole_N ], ..., [LinearRingShell, LinearRingHole_1, ..., LinearRingHole_M]]})

* LinearRingShell is required and defined as a `counterclockwise` ordered array of coordinates [[lng_1,lat_1],...,[lng_i,lat_i],...,[lng_j,lat_j],...,[lng_1,lat_1]]. There can be only one shell.
* LinearRingHole is optional and defined as a `clockwise` ordered array of coordinates [[lng_1,lat_1],...,[lng_i,lat_i],...,[lng_j,lat_j],...,[lng_1,lat_1]]. There can be any number of interior rings and holes.
* LinearRing vertices must be distinct with at least three coordinates. The first coordinate must be equal to the last. At least four entries are required.
* Coordinates [longitude, latitude] must be valid. Longitude must be a real number in the range [-180, +180] and latitude must be a real number in the range [-90, +90].
* LinearRingShell encloses at most half of the sphere. LinearRing divides the sphere into two regions. The smaller of the two regions, is chosen.
* LinearRing edge length must be less than 180 degrees. The shortest edge between the two vertices is chosen.
* LinearRings must not cross and must not share edges. LinearRings might share vertices.

> [!NOTE]
>
> * Polygon doesn't necessarily contain its vertices. Point containment in polygon is defined so that if the Earth is subdivided into polygons, every point is contained by exactly one polygon. Hence, setting Radius = 0 is not equal to not setting it.

**Setting lookup_area_radius (if needed)**

Setting lookup area radius overrides internal mechanism for matching locations to their respective polygons. The value is a distance in meters. Ideally, lookup area radius should represent a distance from polygon center, such that within that distance a point matches to exactly one polygon in one-to-one manner and within that distance, there are no more than a single polygon.
Because the polygons data might be big, polygons may vary greatly in size and shape compared to each other and the proximity of the polygon one to another, it might be challenging to come up with the radius that performs the best. If needed, here is a sample that may help.

PolygonsTable
| project value = sqrt(geo_polygon_area(polygon))
| summarize min = min(value), avg = avg(value), max = max(value)

Try using lookup radius starting from average value towards either minimum (If the polygons are close to each other) or maximum by multiples of 2.

> [!TIP]
>
> * If Locations table has too many coordinates that are close to each other, consider aggregating them using [geo_point_to_s2cell()](geo-point-to-s2cell-function.md).
> * If you want to know if any of the polygons contains a point, try the following steps: Fold the collection of polygons into one multipolygon. Then query this multipolygon. This may improve performance. See the following example.
> * It's might be possible to build a more personalized (or performant) join functionality using [geo_polygon_to_s2cells()](geo-polygon-to-s2cells-function.md).

## Examples

The following example returns only matching rows.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA4VTTW%2FbMAy951cIPrWAa4gSRUoZdhnQW1sU2C5DEARuomZGnSjwx4pg238fHcfZF7DaF4t%2BJN%2Fjo%2BrYqUOqj9u0b9V7tSk7eZ%2FqeHUOrvblLs7brqn223xCzjdHCVfr69lipuTJHuKr%2BpyalyxX519X37LueIjZPHscc%2BRXtk6p2VT7sottNl8sFjdsi8CWHbIGQCbKUReMVmvNHgwS4DIfYZ6cDQY0oAl4gjmUmAZL4MMFFgJoMsZakK%2BxGoCh4JBI%2BwvsrabL5Y%2FrfNT2WDZV%2B19h%2F%2BgyhWNH0jF4T9YID1%2BwcCBmQhFh7UDEFGi0FmHCIgTrRVUotAOyNqAPJFxOKNFM7C1AAHJs7FDNC3XLAZGdyD3B3m45ilq%2Bm9Viep3WZVf97foU%2FdP2Ou23Vddv4ryJZS1nwVyOlyW43R2qJqqPUiuqD31Vy0i2MrjRPmFiLfvhw%2BXqNHGPhkwILGbwedgPp%2B5lre77NvY7lZ7Vfdl9iTuJr9tLMWYvzmMgA3wuZqWusYYZHLpztdvq%2BTnW6lN6jY3kmkJWRyYrbTX5oIdUGaXzhqzsAVAAP6Xepf3mtLQ3ugBr0LkQDBsNgTTmykGBQiMgiYfekj%2BnDeL7ONC%2Bq55i0x2lgnDGQiPKWgpBbUEsHDgLBRCDDDtZUMbRmcmV2XcVv5Z1P8xyG9Nquo51Si%2F9Ybqd7eVK%2FmbSL39y1cSub6as1Us8ittd08frn0Hw5ob4AwAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
let polygons = datatable(polygon_name:string, polygon:dynamic)
[
    "New York", dynamic({"type":"Polygon", "coordinates":[[[-73.97375470114766,40.74300078124614],[-73.98653921014294,40.75486501361894],[-73.99910622331991,40.74112695466084],[-73.97375470114766,40.74300078124614]]]}),
    "Paris", dynamic({"type":"Polygon","coordinates":[[[2.57564669886321,48.769567764921334],[2.420098611499384,49.05163394896812],[2.1016783119165723,48.80113794475062],[2.57564669886321,48.769567764921334]]]}),
];
let locations = datatable(location_name:string, longitude:real, latitude:real)
[
    "Empire State Building", -73.98567337898565, 40.74842629977377,
    "National Museum of Mathematics", -73.98778501496217, 40.743565232771545,
    "Eiffel Tower", 2.294489426068907, 48.858263476169185,
    "London", -0.13245599272019604, 51.49879464208368,
    "Statue of Liberty",  -74.04462223203123, 40.689195627512674,
];
locations
| evaluate geo_polygon_lookup(polygons, polygon, longitude, latitude, return_lookup_key = true)
```

**Output**

|location_name|longitude|latitude|polygon_name|polygon
|---|---|---|---|---|
|NY National Museum of Mathematics|-73.9877850149622|40.7435652327715|New York|{"type":"Polygon","coordinates":[[[-73.97375470114766,40.74300078124614],[-73.98653921014294,40.75486501361894],[-73.99910622331992,40.74112695466084],[-73.97375470114766,40.74300078124614]]]}|
|Empire State Building|-73.9856733789857|40.7484262997738|New York|{"type":"Polygon","coordinates":[[[-73.97375470114766,40.74300078124614],[-73.98653921014294,40.75486501361894],[-73.99910622331992,40.74112695466084],[-73.97375470114766,40.74300078124614]]]}|
|Eiffel Tower|2.29448942606891|48.8582634761692|Paris|{"type":"Polygon","coordinates":[[[2.57564669886321,48.769567764921337],[2.420098611499384,49.05163394896812],[2.1016783119165725,48.80113794475062],[2.57564669886321,48.769567764921337]]]}|

The following example returns both matching and nonmatching rows.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA4VTTW%2FbMAy951cIPjWAa4gSJUoZdhnQWxsU2C5FEARuoqRGHCvwx4pg238fHTtptwGrfZEo8uk9PqoMrTjG8rSLVSM%2Bi03e8v9chpsxuKryQ5g1bV1Uu%2FSSOducOFysp5PFRPCXzMOreIr1PknFeHTzI2lPx5DMksehho%2BSdYz1pqjyNjTJbLFY3JLOPGkySBIAydoUZUaopZTkQKEFXKZDmrNGewUSUHk8pxnkmARtwflrmvcgrVJaA68GNABlvUFrpbumfXTpcvlrmg7aHvO6aP4r7B9dKjNkLN%2FonbNaMQ%2BXEXOwRBZZhNY9EZWhkpKFMQvvtWNVPpMGrNYenbfM5ZzFmi05DeDBGlK6R3NMXZNHJMNyz2kfXzmIWn6alGx6Gdd5W%2Fzt%2BiX6p%2B1lrHZF223CrA55yXvOuW6vQ3B3OBZ1EF8ZK4gvXVFyS3bcuME%2BZqI1uX5hUnHuuENllffEZtDY7PmTmJ8J5KV46JrQHUTcioe8fQkHjq%2BbKx6RY%2FPRWwU04mmGVloRgUEzAt4V220oxbf4GmquVRlPDzeXb5bWedmXcjeNU1bzKID14C6l97HanOf2VmagFRrjvSIlwVuJqTCQIdPwaNlGp60by3r9Xehp3xfPoW5PjMCcMZOIPJlMUGpgF3vOTAHYI0WGZ5RwMOdizOSnCN%2FzsuvbuQtxdXmRZYz77nh5oM31Vb7z6c2iVNSh7epq1VXcwPVL2LDfbd29HQxwq304jSfT34Q6nR0UBAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
let polygons = datatable(polygon_name:string, polygon:dynamic)
[
    "New York", dynamic({"type":"Polygon", "coordinates":[[[-73.97375470114766,40.74300078124614],[-73.98653921014294,40.75486501361894],[-73.99910622331991,40.74112695466084],[-73.97375470114766,40.74300078124614]]]}),
    "Paris", dynamic({"type":"Polygon","coordinates":[[[2.57564669886321,48.769567764921334],[2.420098611499384,49.05163394896812],[2.1016783119165723,48.80113794475062],[2.57564669886321,48.769567764921334]]]}),
];
let locations = datatable(location_name:string, longitude:real, latitude:real)
[
    "Empire State Building", -73.98567337898565, 40.74842629977377,
    "NY National Museum of Mathematics", -73.98778501496217, 40.743565232771545,
    "Eiffel Tower", 2.294489426068907, 48.858263476169185,
    "London", -0.13245599272019604, 51.49879464208368,
    "Statue of Liberty",  -74.04462223203123, 40.689195627512674,
];
locations
| evaluate geo_polygon_lookup(polygons, polygon, longitude, latitude, return_unmatched = true, return_lookup_key = true)
```

**Output**

|location_name|longitude|latitude|polygon_name|polygon
|---|---|---|---|---|
|NY National Museum of Mathematics|-73.9877850149622|40.7435652327715|New York|{"type":"Polygon","coordinates":[[[-73.97375470114766,40.74300078124614],[-73.98653921014294,40.75486501361894],[-73.99910622331992,40.74112695466084],[-73.97375470114766,40.74300078124614]]]}|
|Empire State Building|-73.9856733789857|40.7484262997738|New York|{"type":"Polygon","coordinates":[[[-73.97375470114766,40.74300078124614],[-73.98653921014294,40.75486501361894],[-73.99910622331992,40.74112695466084],[-73.97375470114766,40.74300078124614]]]}|
|Eiffel Tower|2.29448942606891|48.8582634761692|Paris|{"type":"Polygon","coordinates":[[[2.57564669886321,48.769567764921337],[2.420098611499384,49.05163394896812],[2.1016783119165725,48.80113794475062],[2.57564669886321,48.769567764921337]]]}|
|Statue of Liberty|-74.04462223203123|40.689195627512674|||
|London|-0.13245599272019604|51.498794642083681|||

The following example returns both matching and nonmatching rows where radius is set to 7km.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA4VTyW7bMBC9%2BysInRJAEbgMZ0gXvRTILQkCtJfAMAzFoh0hsmhoaWC0%2FfeOLFndgMa%2BiLM8vjdvWIVOHGN12se6FR9FkXf8f67C1RTc1PkhLNuuKet9eqlcFicOl9vrxWoh%2BJc8hDfxFJvXJBVT6upb0p2OIVkmj2MPp5JtjE1R1nkX2mS5Wq1uyGSeDFkgqRQQYgoyIzBSSnJKAypYp2OZQ2u8VlKB9nAus8AxqQwq5%2Bcy75VErY1R%2FDWiKaXRW0CUbi5779L1%2Bsd1Omp7zJuy%2Fa%2Bwf3TpzJJFvtE7h0YzD5cRc0AiBBZhzEBEZ6ClZGHMwnvjWJXPpFVojAfnkbmcq1gzkjNKeYWWtBnQHFM35AHIstxz2ftXjqLWHxYVm17Fbd6Vf7t%2Bif5pexXrfdn1RVg2Ia%2F4zDXzcV6C28OxbIL4zFhBfOrLikey58GN9jETY8gNHzYV54k70Ki9JzaDpmE%2FPImHM4G8Evd9G%2FqDiDtxn3cv4cDxbTvjETk2HzxqRROeYWhtNJGyYCfA23K3C5X4Et9Cw7064%2B3h4fLNEp2XQytP0zqNhldBoVfu0noX6%2BK8tzcyU0aDtd5r0lJ5lJAKqzJgGh6QbXQG3dQ26O%2FDQPuufA5Nd2IE5gyZBODNZILSKHZx4MwUFHukyfKOEozmXIxZfBfha171wzj3IW4uL7KK8bU%2FXh5oO7%2FK33z6ZVEqmrwo%2B8Fl4gXnY%2Bj6pt70Nc9z%2BxIKTnRNH%2BbEiL55Dacpc%2F0TGYvNayMEAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
let polygons = datatable(polygon_name:string, polygon:dynamic)
[
    "New York", dynamic({"type":"Polygon", "coordinates":[[[-73.97375470114766,40.74300078124614],[-73.98653921014294,40.75486501361894],[-73.99910622331991,40.74112695466084],[-73.97375470114766,40.74300078124614]]]}),
    "Paris", dynamic({"type":"Polygon","coordinates":[[[2.57564669886321,48.769567764921334],[2.420098611499384,49.05163394896812],[2.1016783119165723,48.80113794475062],[2.57564669886321,48.769567764921334]]]}),
];
let locations = datatable(location_name:string, longitude:real, latitude:real)
[
    "Empire State Building", -73.98567337898565, 40.74842629977377,
    "NY National Museum of Mathematics", -73.98778501496217, 40.743565232771545,
    "Eiffel Tower", 2.294489426068907, 48.858263476169185,
    "London", -0.13245599272019604, 51.49879464208368,
    "Statue of Liberty",  -74.04462223203123, 40.689195627512674,
];
locations
| evaluate geo_polygon_lookup(polygons, polygon, longitude, latitude, radius = 7000, return_unmatched = true, return_lookup_key = true)
```

**Output**

|location_name|longitude|latitude|polygon_name|polygon
|---|---|---|---|---|
|NY National Museum of Mathematics|-73.9877850149622|40.7435652327715|New York|{"type":"Polygon","coordinates":[[[-73.97375470114766,40.74300078124614],[-73.98653921014294,40.75486501361894],[-73.99910622331992,40.74112695466084],[-73.97375470114766,40.74300078124614]]]}|
|Empire State Building|-73.9856733789857|40.7484262997738|New York|{"type":"Polygon","coordinates":[[[-73.97375470114766,40.74300078124614],[-73.98653921014294,40.75486501361894],[-73.99910622331992,40.74112695466084],[-73.97375470114766,40.74300078124614]]]}|
|Eiffel Tower|2.29448942606891|48.8582634761692|Paris|{"type":"Polygon","coordinates":[[[2.57564669886321,48.769567764921337],[2.420098611499384,49.05163394896812],[2.1016783119165725,48.80113794475062],[2.57564669886321,48.769567764921337]]]}|
|Statue of Liberty|-74.04462223203123|40.689195627512674|New York|{"type":"Polygon","coordinates":[[[-73.97375470114766,40.74300078124614],[-73.98653921014294,40.75486501361894],[-73.99910622331992,40.74112695466084],[-73.97375470114766,40.74300078124614]]]}|	
|London|-0.13245599272019604|51.498794642083681|||	

The following example counts locations by polygon.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA4VTTW%2FbMAy951cIPiWAa4gSJUoZdhnQWxsU2C5FEBROomRGHSvwx4rs47%2BPjhO324DVvkgU%2BfQeH1WGVhxjedrHqhEfxTZv%2BV%2BXYXoJPlX5Icybti6qfXrNnG9PHC42s8lyIvhLFuFFPMb6OUnF5Wj6I2lPx5DMk4ehho%2BSTYz1tqjyNjTJfLlc3pDOPGkySBIAydoUZUaopZTkQKEFXKVDmrNGewUSUHk8pxnkmARtwfkxzXuQVimtgVcDGoCy3qC10o1p7126Wv2apYO2h7wumv8K%2B0eXygwZyzd656xWzMNlxBwskUUWoXVPRGWopGRhzMJ77ViVz6QBq7VH5y1zOWexZktOA3iwhpTu0RxT1%2BQRybDcc9r7Vw6iVh8mJZtexk3eFn%2B7fo3%2BaXsZq33Rdtswr0Ne8p5zxu04BLeHY1EH8ZmxgvjUFSW3ZM%2BNG%2BxjJlqT6xcmFeeOO1RWeU9sBl2avXgUizOBvBT3XRO6g4g7cZ%2B3X8OB45tmxCNybD56q4AueJqhlVZEYNBcAG%2BL3S6U4kt8CTXXqoynh5vLN0vrvOxLuZvGKat5FMB6cNfSu1htz3N7IzPQCo3xXpGS4K3EVBjIkGl4tGyj09Zdynr9Xehp3xXrULcnRmDOmElEnkwmKDWwiz1npgDskSLDM0o4mHM1ZvJThG952fXt3If4dH2RZYzP3fH6QJvxVb7x6dWiGaM03eHAQ%2Fw9iE3sqnY6E%2BuTePu%2BfwNaTfqKBQQAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
let polygons = datatable(polygon_name:string, polygon:dynamic)
[
    "New York", dynamic({"type":"Polygon", "coordinates":[[[-73.97375470114766,40.74300078124614],[-73.98653921014294,40.75486501361894],[-73.99910622331991,40.74112695466084],[-73.97375470114766,40.74300078124614]]]}),
    "Paris", dynamic({"type":"Polygon","coordinates":[[[2.57564669886321,48.769567764921334],[2.420098611499384,49.05163394896812],[2.1016783119165723,48.80113794475062],[2.57564669886321,48.769567764921334]]]}),
];
let locations = datatable(location_name:string, longitude:real, latitude:real)
[
    "Empire State Building", -73.98567337898565, 40.74842629977377,
    "NY National Museum of Mathematics", -73.98778501496217, 40.743565232771545,
    "Eiffel Tower", 2.294489426068907, 48.858263476169185,
    "London", -0.13245599272019604, 51.49879464208368,
    "Statue of Liberty",  -74.04462223203123, 40.689195627512674,
];
locations
| evaluate geo_polygon_lookup(polygons, polygon, longitude, latitude)
| summarize count() by polygon_name
```

**Output**

|polygon_name|count_|
|---|---|
|New York|2|
|Paris|1|


## Related content

* Overview of [geo_point_in_polygon()](geo-point-in-polygon-function.md)
* Overview of [geo_distance_point_to_polygon()](geo-distance-point-to-polygon-function.md)
* Overview of [geo_polygon_to_s2cells()](geo-polygon-to-s2cells-function.md)
