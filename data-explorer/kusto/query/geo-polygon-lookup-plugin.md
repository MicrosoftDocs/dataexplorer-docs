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

*T* `|` `evaluate` `geo_polygon_lookup(` *LookupTable* `,` *LookupPolygonKey* `,` *SourceLongitude* `,` *SourceLatitude* `,` [ *radius* ] `,` [ *return_unmatched* ] `,` [ *lookup_area_radius* ] `)`

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

The following example returns only matching rows

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA4VTTW%2FbMAy951cIPrWAa4gSRUoZdhnQW1sU2C5DEBRuomRGnSjwx4pg238fHSfeF7DaF4t%2BJN%2Fjo%2BrYqUOqj9u0b9V7tS47eZ%2FreHUOPu3LXZy3XVPtt%2FkFOV8fJVytrmeLmZIne4iv6nNqXrJcnX9dfcu64yFm8%2BxxzJFf2SqlZl3tyy622XyxWNywLQJbdsgaAJkoR10wWq01ezBIgMt8hHlyNhjQgCbgCeZQYhosgQ8TLATQZIy1IF9jNQBDwSGR9hPsrabL5Y%2FrfNT2WDZV%2B19h%2F%2BgyhWNH0jF4T9YID1%2BwcCBmQhFh7UDEFGi0FmHCIgTrRVUotAOyNqAPJFxOKNFM7C1AAHJs7FDNC3XLAZGdyD3B3m45ilq%2Bm9Viep1WZVf97fol%2Bqftddpvq65fx3kTy1rOgpmO0xLc7g5VE9VHqRXVh76qZSRbGdxonzCxlv3w4XJ1mrhHQyYEFjP4POyHU%2FeyVvd9G%2FudSht1X3Zf4k7iq3YqxuzFeQxkgM%2FFrNQ11jCDQ3eudlttNrFWn9JrbCTXFLI6Mllpq8kHPaTKKJ03ZGUPgAL4S%2Bpd2q9PS3ujC7AGnQvBsNEQSGOuHBQoNAKSeOgt%2BXPaIL6PA%2B276jk23VEqCGcsNKKspRDUFsTCgbNQADHIsJMFZRydubgy%2B67i17Luh1luY3q6XMc6pZf%2BcLmd7XQlfzPplz%2FXPwGFbZi43gMAAA%3D%3D" target="_blank">Run the query</a>
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
| evaluate geo_polygon_lookup(polygons, polygon, longitude, latitude)
```

**Output**

|location_name|longitude|latitude|polygon_name|polygon
|---|---|---|---|---|
|NY National Museum of Mathematics|-73.9877850149622|40.7435652327715|New York|{"type":"Polygon","coordinates":[[[-73.97375470114766,40.74300078124614],[-73.98653921014294,40.75486501361894],[-73.99910622331992,40.74112695466084],[-73.97375470114766,40.74300078124614]]]}|
|Empire State Building|-73.9856733789857|40.7484262997738|New York|{"type":"Polygon","coordinates":[[[-73.97375470114766,40.74300078124614],[-73.98653921014294,40.75486501361894],[-73.99910622331992,40.74112695466084],[-73.97375470114766,40.74300078124614]]]}|
|Eiffel Tower|2.29448942606891|48.8582634761692|Paris|{"type":"Polygon","coordinates":[[[2.57564669886321,48.769567764921337],[2.420098611499384,49.05163394896812],[2.1016783119165725,48.80113794475062],[2.57564669886321,48.769567764921337]]]}|

The following example returns both matching and nonmatching rows

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA4VTS2%2FbMAy%2B51cIPrWAa4gSRUoZdhnQW1sU2C5FEBRuoqZGHSvwY0Ww7b%2BPjpPsBaz2RaJI6ntQdezVLtX7TWo69VGty17%2BpzpeHIOPTbmN865vq2aTnzLn672Eq9XlbDFT8mV38U09pPY1y9Xx6OJb1u93MZtn91ONHGWrlNp11ZR97LL5YrG4YlsEtuyQNQAyUY66YLRaa%2FZgkACX%2BZTmydlgQAOagIc0hxLTYAl8OKeFAJqMsRZkNXUDMBQcEml%2FTnvv0uXyx2U%2Bcbsv26r7L7F%2FeJnCsSO5MXhP1ggOX7BgIGZCIWHtCMQUaLQWYoIiBOuFVSi0A7I2oA8kWA5ZwpnYW4AA5NjYsZsX6JYDIjuhe0h7%2F8qJ1PLDrBbT67Qq%2B%2Bpv10%2FRP22vU7Op%2BmEd520sa9lLznl7HoLr7a5qo%2FosvaL6NFS1SLIR4Sb7BIm17MeFy9VBcY%2BGTAgsZvBR7LsHdXcAUNbqdujisFXpWd2W%2FUvcSnzVnfsxezEfAxngYz8rrY01zODQHRteV8%2FPsVZf0ltspdYUMj0irtysyQc9loqazhuyMgpAAfyp9CY168PcXukCrEHnQjBsNATSmCsHBQqMgCQ2ekv%2BWDbyH%2BII%2B6Z6im2%2Flw6CGQuNKJMpALUFcXHELBBAPDLsZEYZJ3NOxsy%2Bq%2Fi1rIdRzk1Mj6cXWaf0OuxOD7Q7v8rffPplUa7a2A9t8zg0IuDqJa7F774d4uVPe7lNOPoDAAA%3D" target="_blank">Run the query</a>
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
| evaluate geo_polygon_lookup(polygons, polygon, longitude, latitude, return_unmatched = true)
```

**Output**

|location_name|longitude|latitude|polygon_name|polygon
|---|---|---|---|---|
|NY National Museum of Mathematics|-73.9877850149622|40.7435652327715|New York|{"type":"Polygon","coordinates":[[[-73.97375470114766,40.74300078124614],[-73.98653921014294,40.75486501361894],[-73.99910622331992,40.74112695466084],[-73.97375470114766,40.74300078124614]]]}|
|Empire State Building|-73.9856733789857|40.7484262997738|New York|{"type":"Polygon","coordinates":[[[-73.97375470114766,40.74300078124614],[-73.98653921014294,40.75486501361894],[-73.99910622331992,40.74112695466084],[-73.97375470114766,40.74300078124614]]]}|
|Eiffel Tower|2.29448942606891|48.8582634761692|Paris|{"type":"Polygon","coordinates":[[[2.57564669886321,48.769567764921337],[2.420098611499384,49.05163394896812],[2.1016783119165725,48.80113794475062],[2.57564669886321,48.769567764921337]]]}|
|Statue of Liberty|-74.04462223203123|40.689195627512674|||
|London|-0.13245599272019604|51.498794642083681|||

The following example returns both matching and nonmatching rows where radius is set to 7km

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA4VTTW%2FbMAy951cIPjWAa4gSJUoZdhnQWxsU2C5FEARurKRGHSvwx4pg238fHSfeF7DaF4kin97jo6rQiWOsTvtYt%2BKjKPKO%2F%2Bcq3FyCmzo%2FhEXbNWW9T6%2BZi%2BLE4XI7n61mgr9kGd7EU2xek1Rcjm6%2BJd3pGJJF8jjW8FGyjbEpyjrvQpssVqvVLenMkyaDJAGQrE1RZoRaSkkOFFrAdTqmOWu0VyABlcdzmkGOSdAWnJ%2FSvAdpldIaeDWiASjrDVor3ZT23qXr9Y95Omp7zJuy%2Fa%2Bwf3SpzJCxfKN3zmrFPFxGzMESWWQRWg9EVIZKShbGLLzXjlX5TBqwWnt03jKXcxZrtuQ0gAdrSOkBzTF1TR6RDMs9p71%2F5Shq%2FWFWselV3OZd%2Bbfr1%2Biftlex3pddX4RFE%2FKK95wzbachuDscyyaIz4wVxKe%2BrLgle27caB8z0ZrcsDCpOHfcobLKe2Iz6NLs5ZNYngnklXjo29AfRNyJh7x7CQeOb9sJj8ix%2BeitArrgaYZWWhGBQXMBvCt3u1CJL%2FEtNFyrMp4ebi7fLK3zcijlbhqnrOZRAOvBXUvvY12c5%2FZWZqAVGuO9IiXBW4mpMJAh0%2FBo2UanrbuUDfr7MNC%2BL59D050YgTljJhF5Mpmg1MAuDpyZArBHigzPKOFoztWY2XcRvuZVP7RzH%2BLm%2BiKrGF%2F74%2FWBttOr%2FM2nXxalosmLsh9cJh5w3oaub%2BpNX3M%2Fty%2Bh4IOu6cP8J0fbkBEJBAAA" target="_blank">Run the query</a>
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
| evaluate geo_polygon_lookup(polygons, polygon, longitude, latitude, radius = 7000, return_unmatched = true)
```

**Output**

|location_name|longitude|latitude|polygon_name|polygon
|---|---|---|---|---|
|NY National Museum of Mathematics|-73.9877850149622|40.7435652327715|New York|{"type":"Polygon","coordinates":[[[-73.97375470114766,40.74300078124614],[-73.98653921014294,40.75486501361894],[-73.99910622331992,40.74112695466084],[-73.97375470114766,40.74300078124614]]]}|
|Empire State Building|-73.9856733789857|40.7484262997738|New York|{"type":"Polygon","coordinates":[[[-73.97375470114766,40.74300078124614],[-73.98653921014294,40.75486501361894],[-73.99910622331992,40.74112695466084],[-73.97375470114766,40.74300078124614]]]}|
|Eiffel Tower|2.29448942606891|48.8582634761692|Paris|{"type":"Polygon","coordinates":[[[2.57564669886321,48.769567764921337],[2.420098611499384,49.05163394896812],[2.1016783119165725,48.80113794475062],[2.57564669886321,48.769567764921337]]]}|
|Statue of Liberty|-74.04462223203123|40.689195627512674|New York|{"type":"Polygon","coordinates":[[[-73.97375470114766,40.74300078124614],[-73.98653921014294,40.75486501361894],[-73.99910622331992,40.74112695466084],[-73.97375470114766,40.74300078124614]]]}|	
|London|-0.13245599272019604|51.498794642083681|||	

The following example counts locations by polygon

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
