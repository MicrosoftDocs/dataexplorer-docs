---
title:  geo_line_to_s2cells()
description: Learn how to use the geo_line_to_s2cells() function to calculate S2 cell tokens that cover a line or a multiline on Earth.
ms.reviewer: mbrichko
ms.topic: reference
ms.date: 03/09/2023
---
# geo_line_to_s2cells()

Calculates S2 cell tokens that cover a line or multiline on Earth. This function is a useful geospatial join tool.

## Syntax

`geo_line_to_s2cells(`*lineString* [`,` *level*[ `,` *radius*]]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *lineString* | `dynamic` |  :heavy_check_mark: | Line or multiline in the [GeoJSON format](https://tools.ietf.org/html/rfc7946).|
| *level* | `int` | | Defines the requested cell level. Supported values are in the range [0, 30]. If unspecified, the default value `11` is used.|
| *radius* | `real` | | Buffer radius in meters. If unspecified, the default value `0` is used.|

## Returns

Array of S2 cell token strings that cover a line or a multiline. If the radius is set to a positive value, then the covering will be of both input shape and all points within the radius of the input geometry.

If any of the following:  line, level, radius is invalid, or the cell count exceeds the limit, the query will produce a null result.

> [!NOTE]
>
> * Covering the line with S2 cell tokens can be useful in matching coordinates to lines, thus finding points nearby lines.
> * The line covering tokens are of the same S2 cell level.
> * The maximum count of tokens per line is 65536.
> * The [geodetic datum](https://en.wikipedia.org/wiki/Geodetic_datum) used to measure distance on Earth is a sphere. Line edges are [geodesics](https://en.wikipedia.org/wiki/Geodesic) on the sphere.
> * If input line edges are straight cartesian lines, consider using [geo_line_densify()](geo-line-densify-function.md) in order to convert planar edges to geodesics.

**Choosing the S2 cell level**

* Ideally we would want to cover every line with one or just a few unique cells such that no two lines share the same cell. 
* In practice, try covering with just a few cells, no more than a dozen. Covering with more than 10,000 cells might not yield good performance.
* Query run time and memory consumption might differ greatly because of different S2 cell level values.

**Performance improvement suggestions**

* If possible, reduce coordinates table size before join, by grouping coordinates that are very close to each other by using [geospatial clustering](geospatial-grid-systems.md) or by filtering out unnecessary coordinates due to nature of the data or business needs.
* If possible, reduce lines count due to nature of the data or business needs. Filter out unnecessary lines before join, scope to the area of interest or unify lines.
* In case of very big lines, reduce their size using [geo_line_simplify()](geo-line-simplify-function.md).
* Changing S2 cell level may improve performance and memory consumption.
* Changing [join kind and hint](join-operator.md) may improve performance and memory consumption.
* In case positive radius is set, reverting to radius 0 on buffered shape using [geo_line_buffer()](geo-line-buffer-function.md) may improve performance.

## Examples

The following query finds all tube stations within 500 meters of streets and aggregates tubes count by street name.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA5VTTXObMBC98yt2uBRmiCNhBMKpLzl2cuhMjhkPI4PqKAHJAyKJW/e/dyXwR3IrF6TV7tv3nlattNCLRo0DrIERche0GLHjVlaDFVYZ7Q4agWuxbWV0fVJp0cnVYHuldwm0erfqpWhxJewK3DIOngLAL3y0C/iBycM3+Cn61zCB+bshC7rMGCUFZzknuOZ5AowusrKkJc0YZ5wWaeJhIHwwujEa7nvV7CTMNBANYQjPyrRgKc0dypIXHoaRjBf5kuZZRhBuxrm9hc70EvZGaTsEm0k0CpHSfpY7xb4IVVqumgPGVH1WeD/Wr3j6LDpU2IpaIqs5J/oT2sNehqvwASsfPUqYhLUxfaO0sHIIV09P3omyzFleEJ7yJcpIvABaEk7SNOOcsU3i8zLCOUrkSy+YZFMioSlWFjm6lm42f+NJ7GfPJuf/lxjhBWXp1KVkZT7RQBLLjEzRnFJy6Xny1zl1tvcFza5a+SZbdJhmU9Bn4L7Dbr0Srfp98nyAI8gPK3UDqsEMLd+r3aiaKI6n0t4X+n5TH7c6wr43L7K2WJRAbd6kE4V5O2kql1ZZUw1pLdt2iNw+ueKVzC8hnqG6txv5sRfI4AxkDTjLzK9omoZTqgMBHIBmrbSWPTzjYC0wBWXtDuttb0RTi8H67Cg4Tf+nZ3aOnnV/oe+n9cI/av0wCnstYeITA174qfoucE4doTXmddzPjuO5aoIjvD9LvCeH3igkomt5aeMyr5q4bQzf17NJWDyMXSd6vDLsNWqLNP0/imF7APdkMHL1gP4ByJEmm2sEAAA=" target="_blank">Run the query</a>

```kusto
let radius = 500;
let tube_stations = datatable(tube_station_name:string, lng:real, lat: real)
[
    "St. James' Park",        -0.13451078568013486, 51.49919145858172,
     "London Bridge station", -0.08492752160134387, 51.504876316440914,
     // more points
];
let streets = datatable(street_name:string, line:dynamic)
[
    "Buckingham Palace", dynamic({"type":"LineString","coordinates":[[-0.1399656708283601,51.50190802248855],[-0.14088438832752104,51.50012082761452]]}),
    "London Bridge",    dynamic({"type":"LineString","coordinates":[[-0.087152,51.509596],[-0.088340,51.506110]]}),
    // more lines
];
let join_level = 14;
let lines = materialize(streets | extend id = new_guid());
let res = 
    lines
    | project id, covering = geo_line_to_s2cells(line, join_level, radius)
    | mv-expand covering to typeof(string)
    | join kind=inner hint.strategy=broadcast
    (
        tube_stations
        | extend covering = geo_point_to_s2cell(lng, lat, join_level)
    ) on covering;
res | lookup lines on id
| where geo_distance_point_to_line(lng, lat, line) <= radius
| summarize count = count() by name = street_name
```

|name|count|
|---|---|
|Buckingham Palace|1|
|London Bridge|1|

In case of invalid line, a null result will be returned.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVHIycxLVbBVSKnMS8zNTNaoViqpLEhVslLyAYoHlxRl5qUr6Sgl5+cXpWTmJZakFitZRUdHG+gYxOqAydjYWk1rrgKguhKFzOK80pwcjfTU/HiQqfEl+fHFRsmpOTnFGiC+piYA0P7Z6XAAAAA=" target="_blank">Run the query</a>

```kusto
let line = dynamic({"type":"LineString","coordinates":[[[0,0],[0,0]]]});
print isnull(geo_line_to_s2cells(line))
```

|print_0|
|---|
|True|
