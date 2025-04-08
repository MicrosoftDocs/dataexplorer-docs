---
title:  geo_line_lookup plugin
description: Learn how to use the geo_line_lookup plugin to look up a line value in a lookup table.
ms.reviewer: mbrichko
ms.topic: reference
ms.date: 03/20/2025
---
# geo_line_lookup plugin (preview)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] 

The `geo_line_lookup` plugin looks up a `Line` value in a lookup table and returns rows with matched values. The plugin is invoked with the [`evaluate`](evaluate-operator.md) operator.

## Syntax

*T* `|` `evaluate` `geo_line_lookup(` *LookupTable* `,` *LookupLineKey* `,` *SourceLongitude* `,` *SourceLatitude* `,` *Radius* `,` [ *return_unmatched* ] `,` [ *lookup_area_radius* ] `)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T* | `string` |  :heavy_check_mark: | The tabular input whose columns *SourceLongitude* and *SourceLatitude* are used for line matching.|
| *LookupTable* | `string` |  :heavy_check_mark: | Table or tabular expression with lines lookup data, whose column *LookupLineKey* is used for line matching.|
| *LookupLineKey* | `dynamic` |  :heavy_check_mark: | The column of *LookupTable* with line or multiline in the [GeoJSON format](https://tools.ietf.org/html/rfc7946) and of dynamic type that is matched against each *SourceLongitude*, *SourceLatitudes* values.|
| *SourceLongitude* | `real` |  :heavy_check_mark: | The column of *T* with longitude value to be looked up in *LookupTable*. Longitude value in degrees. Valid value is a real number and in the range [-180, +180].|
| *SourceLatitude* | `real` |  :heavy_check_mark: | The column of *T* with latitude value to be looked up in *LookupTable*. Latitude value in degrees. Valid value is a real number and in the range [-90, +90].|
| *Radius* | `real` | :heavy_check_mark: | Length from the line where the source location is considered a match.|
| *return_unmatched* | `bool` | | An optional boolean flag that defines if the result should include all or only matching rows (default: `false` - only matching rows returned).|
| *lookup_area_radius* | `real` | | An optional lookup area radius distance in meters value that may help in matching locations to their respective lines.|

## Returns

The `geo_line_lookup` plugin returns a result of join (lookup). The schema of the table is the union of the source table and the lookup table, similar to the result of the [`lookup` operator](lookup-operator.md).

Location distance from a line is tested via [geo_distance_point_to_line()](geo-distance-point-to-line-function.md).

If the *return_unmatched* argument is set to `true`, the resulting table includes both matched and unmatched rows (filled with nulls).

If the *return_unmatched* argument is set to `false`, or omitted (the default value of `false` is used), the resulting table has as many records as matching results. This variant of lookup has better performance compared to `return_unmatched=true` execution.

Setting *lookup_area_radius* length overrides internal matching mechanism and may improve or worsen run time and\or memory consumption. It does not affect query correctness. Read more below on how to set this optional value.

> [!NOTE]
>
> * This plugin covers the scenario of classifying locations to lines within a radius from the line, assuming a small lookup table size, with the input table optionally having a larger size.
> * The performance of the plugin will depend on the sizes of the lookup and data source tables, the number of columns, and number of matching records.
> * The geospatial coordinates are interpreted as represented by the [WGS-84](https://earth-info.nga.mil/index.php?dir=wgs84&action=wgs84) coordinate reference system.
> * The [geodetic datum](https://en.wikipedia.org/wiki/Geodetic_datum) used to measure distance on Earth is a sphere. Line edges are [geodesics](https://en.wikipedia.org/wiki/Geodesic) on the sphere.
> * If input line edges are straight cartesian lines, consider using [geo_line_densify()](geo-line-densify-function.md) in order to convert planar edges to geodesics.
> * Input lines should be valid.

**LineString definition and constraints**

dynamic({"type": "LineString","coordinates": [[lng_1,lat_1], [lng_2,lat_2],..., [lng_N,lat_N]]})

dynamic({"type": "MultiLineString","coordinates": [[line_1, line_2, ..., line_N]]})

* LineString coordinates array must contain at least two entries.
* Coordinates [longitude, latitude] must be valid where longitude is a real number in the range [-180, +180] and latitude is a real number in the range [-90, +90].
* Edge length must be less than 180 degrees. The shortest edge between the two vertices is chosen.

**Setting lookup_area_radius (if needed)**

Setting lookup area radius overrides internal mechanism for matching locations to their respective lines. The value is a distance in meters. Ideally, lookup area radius should represent a distance from line center, such that within that distance a point matches to exactly one line in one-to-one manner and within that distance, there are no more than a single line.
Because the lines data might be big, lines may vary greatly in size and shape compared to each other and the proximity of the line one to another, it might be challenging to come up with the radius that performs the best. If needed, here is a sample that may help.

LinesTable
| project value = geo_line_length(line)
| summarize min = min(value), avg = avg(value), max = max(value)

Try using lookup radius starting from average value towards either minimum (If the lines are close to each other) or maximum by multiples of 2.

> [!TIP]
>
> * If Locations table has too many coordinates that are close to each other, consider aggregating them using [geo_point_to_s2cell()](geo-point-to-s2cell-function.md).
> * It's might be possible to build a more personalized (or performant) join functionality using [geo_line_to_s2cells()](geo-line-to-s2cells-function.md).

## Examples

The examples in this section shows how to use the syntax to help you get started.

###  Matching rows only

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA5WSQY%2FTMBCF7%2F0VVk5bKVT22OOxu%2BIACHFghZB2L6iqKm%2FjLRGuU6XuShXw35kk7cIeiS%2Fx%2BOXl%2BZtJsYi%2BC81RvBVNKLweU7wZKpsc9nF5LH2bd%2FWoWTZnrrXb%2BWw1E%2FxUWL6Ld88xn6L48q2qxeX85mdVzodYLau7Nsf70aGqq23X9U2bQ4nHarlavSG98AReOWuIJJKpjVyQNeAQFaBxYNb1JPMkndVOKe38JNPKoNLoQJFT6%2FXveT1F%2BhpS2MYh1X%2FnkQvlCK13IA1KCWBsjWqBEgx6Y6y1iDQkGoReOlSejATU2sEkRGM8AknrpZ4yrW9niQmnbhtK2%2BXXlK%2FV16RTl3dtOTVx2ceQeM%2Bal%2B0L%2Bo%2F7Q9tHcc9eUbw%2FtakZLyVGXA4taU1ueMFaDLyMM2CBQZImurD61IfciA8xlz4k8RD7PdNIVxMixZAlASrjJxO%2Bm5YaJHfGeby4DBF4ALoncdc%2Bxr6c2YAdzEIyMwBgvVagRwfrvPJogbjBlhs%2BOXyO%2BcjpS5fF1L4hwgDZ8Q8BJX8NzgLbjpSNl1ahtwRa2ZHwle7sl4jPIZ0GJrvYbRK3e5O67sfpMI70cZrjfxj%2FxVsLJeX8DxDDhhwPAwAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
let roads = datatable(road_name:string, road:dynamic)
[
    "5th Avenue NY", dynamic({"type":"LineString","coordinates":[[-73.97291864770574,40.76428551254824],[-73.99708638113894,40.73145135821781]]}),
    "Palace Ave", dynamic({"type":"LineString","coordinates":[[-0.18756982045002246,51.50245944666557],[-0.18908519740253382,51.50544952706903]]}),
];
let locations = datatable(location_name:string, longitude:real, latitude:real)
[
    "Empire State Building", -73.98567337898565, 40.74842629977377,
    "Grand Central Terminal", -73.97713140725149, 40.752730320824895,
    "Statue of Liberty",  -74.04462223203123, 40.689195627512674,
    "Kensington Palace", -0.1885272501232862,  51.504906159672316
];
locations
| evaluate geo_line_lookup(roads, road, longitude, latitude, 100)
```

**Output**

|location_name|longitude|latitude|road_name|road
|---|---|---|---|---|
|Empire State Building|-73.9856733789857|40.7484262997738|5th Avenue NY|{"type":"LineString","coordinates":[[-73.97291864770574,40.76428551254824],[-73.99708638113894,40.73145135821781]]}|
|Kensington Palace|-0.188527250123286|51.5049061596723|Palace Ave|{"type":"LineString","coordinates":[[-0.18756982045002247,51.50245944666557],[-0.18908519740253383,51.50544952706903]]}|


### Both matching and nonmatching rows

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA5WST4%2FTMBDF7%2F0UVk5bKVT22OM%2FRRwAIQ6sENJyQVVVeRvTjXDtynVWWgHfnUnSLuyR5BKPn1%2BefzMxVFay787sDet8pfc%2Bhpuxskv%2BGNbnWvp0aCfNunuiWr9fLjYLRk%2BD9YG9fQxpCOzzt6Zll%2F2bn019OoVm3dz2KdxNDk3b7HMuXZ98Dedmvdm8MnLlDDhhtTKGo1Gt4iujFVhEAagsqG07y5zhVksrhLRulkmhUEi0IIwV2%2B3vZTtH%2BuKj34cx1X%2Fn4SthDWpngSvkHEDpFsUKOSh0SmmtEc2YaBQ6blE4oziglBZmISrlEAzXjss50%2Fb1IhLhmPe%2B9jm9pHytviQdczr0dejCugQfaU2a5%2BUz%2Bg%2FHU18CuyOvwN4NfeymS7EJl0VtpDR2%2FMCWjbyUVaCBQBppzIXVx%2BJTx96HVIuP7GsoR6IRrybGCILMDaBQbjahu0kugVNnrMOLyxiBBiB%2FZ7f9fSj1iQzIQa04MQMA0ksBcnLQ1gmHGgw1WFPDZ4dPIZ0pfc2Jze0bI4yQLf0QkNNpsBrIdqKsHNcCnTYghZ4IX%2BkufrHw6OMwMjmEvIvU7l3M%2Bcdwmkb6PM%2FxP4z%2F4m2Z4Jz2Qx1K2g3p6Ov%2BIXTUsFqGsPwD1vs0ECgDAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
let roads = datatable(road_name:string, road:dynamic)
[
    "5th Avenue NY", dynamic({"type":"LineString","coordinates":[[-73.97291864770574,40.76428551254824],[-73.99708638113894,40.73145135821781]]}),
    "Palace Ave", dynamic({"type":"LineString","coordinates":[[-0.18756982045002246,51.50245944666557],[-0.18908519740253382,51.50544952706903]]}),
];
let locations = datatable(location_name:string, longitude:real, latitude:real)
[
    "Empire State Building", -73.98567337898565, 40.74842629977377,
    "Grand Central Terminal", -73.97713140725149, 40.752730320824895,
    "Statue of Liberty",  -74.04462223203123, 40.689195627512674,
    "Kensington Palace", -0.1885272501232862,  51.504906159672316
];
locations
| evaluate geo_line_lookup(roads, road, longitude, latitude, 100, return_unmatched = true)
```

**Output**

|location_name|longitude|latitude|road_name|road
|---|---|---|---|---|
|Empire State Building|-73.9856733789857|40.7484262997738|5th Avenue NY|{"type":"LineString","coordinates":[[-73.97291864770574,40.76428551254824],[-73.99708638113894,40.73145135821781]]}|
|Kensington Palace|-0.188527250123286|51.5049061596723|Palace Ave|{"type":"LineString","coordinates":[[-0.18756982045002247,51.50245944666557],[-0.18908519740253383,51.50544952706903]]}|
|Statue of Liberty|-74.04462223203123|40.689195627512674|||
|Grand Central Terminal|-73.97713140725149|40.752730320824895|||

### Both matching and nonmatching rows with 350m radius

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA5WST4%2FTMBDF7%2F0UVk5bKVT22OM%2FRRwAIQ6sENJyQVVVeRvTjXDtynVWWgHfnUnSLuyR5BKPn1%2BefzMxVFay787sDet8pfc%2Bhpuxskv%2BGNbnWvp0aCfNunuiWr9fLjYLRk%2BD9YG9fQxpCOzzt6Zll%2F2bn019OoVm3dz2KdxNDk3b7HMuXZ98Dedmvdm8MnLlDDhhtTKGo1Gt4iujFVhEAagsqG07y5zhVksrhLRulkmhUEi0IIwV2%2B3vZTtH%2BuKj34cx1X%2Fn4SthDWpngSvkHEDpFsUKOSh0SmmtEc2YaBQ6blE4oziglBZmISrlEAzXjss50%2Fb1IhLhmPe%2B9jm9pHytviQdczr0dejCugQfaU2a5%2BUz%2Bg%2FHU18CuyOvwN4NfeymS7EJl0VtpDR2%2FMCWjbyUVaCBQBppzIXVx%2BJTx96HVIuP7GsoR6IRrybGCILMDaBQbjahu0kugVNnrMOLyxiBBiB%2FZ7f9fSj1iQzIQa04MQMA0ksBcnLQ1gmHGgw1WFPDZ4dPIZ0pfc2Jze0bI4yQLf0QkNNpsBrIdqKsHNcCnTYghZ4IX%2BkufrHw6OMwMjmEvIvU7l3M%2Bcdwmkb6PM%2FxP4z%2F4m2ZRE77oQ4l7YZ09HX%2FEDpqWC1DWP4B90BZ0SgDAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
let roads = datatable(road_name:string, road:dynamic)
[
    "5th Avenue NY", dynamic({"type":"LineString","coordinates":[[-73.97291864770574,40.76428551254824],[-73.99708638113894,40.73145135821781]]}),
    "Palace Ave", dynamic({"type":"LineString","coordinates":[[-0.18756982045002246,51.50245944666557],[-0.18908519740253382,51.50544952706903]]}),
];
let locations = datatable(location_name:string, longitude:real, latitude:real)
[
    "Empire State Building", -73.98567337898565, 40.74842629977377,
    "Grand Central Terminal", -73.97713140725149, 40.752730320824895,
    "Statue of Liberty",  -74.04462223203123, 40.689195627512674,
    "Kensington Palace", -0.1885272501232862,  51.504906159672316
];
locations
| evaluate geo_line_lookup(roads, road, longitude, latitude, 350, return_unmatched = true)
```

|location_name|longitude|latitude|road_name|road
|---|---|---|---|---|
|Empire State Building|-73.9856733789857|40.7484262997738|5th Avenue NY|{"type":"LineString","coordinates":[[-73.97291864770574,40.76428551254824],[-73.99708638113894,40.73145135821781]]}|
|Kensington Palace|-0.188527250123286|51.5049061596723|Palace Ave|{"type":"LineString","coordinates":[[-0.18756982045002247,51.50245944666557],[-0.18908519740253383,51.50544952706903]]}|
|Grand Central Terminal|-73.97713140725149|40.752730320824895|5th Avenue NY|{"type":"LineString","coordinates":[[-73.97291864770574,40.76428551254824],[-73.99708638113894,40.73145135821781]]}|
|Statue of Liberty|-74.04462223203123|40.689195627512674|||

### Count locations by road

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA5WTS6%2FTMBCF9%2F0VVlatFCp77PGjiAUgxIIrhHTZoKqq3MaUCNeuUudK5fHfmSRt4S5JNvHk5OT4m3EMhXXZN2f2ijW%2B0L2LYT5Utskfw%2BpcujYd6lGzai5Ua%2FeL2XrG6KqwfGOvn0LqA%2Fv4parZ9f38Z1Uup1Ctqoc2hcfRoaqrfc5d0yZfwrlardcvjFw6A05YrYzhaFSt%2BNJoBRZRACoLalNPMme41dIKIa2bZFIoFBItCGPFZvN7UU%2BRPvno92FI9d95%2BFJYg9pZ4Ao5B1C6RrFEDgqdUlprRDMkGoSOWxTOKA4opYVJiEo5BMO143LKtHk5i0Q45r0vbU7PKd%2Bqz0nHnA5t6Zuw6oKPtCbNfXlH%2F%2B54arvAHskrsDd9G5txU2zEZVEbKY0dHrBmAy9lFWggkEYac2X1vvOpYW9DKp2P7HPojkQj3kyMEQSZG0Ch3GRCe5NcAqfOWIdXlyECDUD%2Byh7aXejKhQzIQS05MQMA0ksBcnTQ1gmHGgw1WFPDJ4cPIZ0pfcmJTe0bIgyQLf0QkNPXYDWQ7UhZOa4FOm1ACj0SvtGd%2FWLhycd%2BYHIIeRup3duY8%2Ff%2BNI70eZrjfxj%2FxVsziXxBDuf%2BePRd%2ByOwfe5TmS%2FY7sLuB%2BIPZjahgDADAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
let roads = datatable(road_name:string, road:dynamic)
[
    "5th Avenue NY", dynamic({"type":"LineString","coordinates":[[-73.97291864770574,40.76428551254824],[-73.99708638113894,40.73145135821781]]}),
    "Palace Ave", dynamic({"type":"LineString","coordinates":[[-0.18756982045002246,51.50245944666557],[-0.18908519740253382,51.50544952706903]]}),
];
let locations = datatable(location_name:string, longitude:real, latitude:real)
[
    "Empire State Building", -73.98567337898565, 40.74842629977377,
    "Grand Central Terminal", -73.97713140725149, 40.752730320824895,
    "Statue of Liberty",  -74.04462223203123, 40.689195627512674,
    "Kensington Palace", -0.1885272501232862,  51.504906159672316
];
locations
| evaluate geo_line_lookup(roads, road, longitude, latitude, 350)
| summarize count() by road_name 
```

**Output**

|road_name|count_|
|---|---|
|5th Avenue NY|2|
|Palace Ave|1|


## Related content

* Overview of [geo_distance_point_to_line()](geo-distance-point-to-line-function.md)
* Overview of [geo_line_to_s2cells()](geo-line-to-s2cells-function.md)
