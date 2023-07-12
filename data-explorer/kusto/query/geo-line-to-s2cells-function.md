---
title:  geo_line_to_s2cells()
description: Learn how to use the geo_line_to_s2cells() function to calculate S2 cell tokens that cover a line or a multiline on Earth.
ms.reviewer: mbrichko
ms.topic: reference
ms.date: 03/09/2023
---
# geo_line_to_s2cells()

Calculates S2 cell tokens that cover a line or multiline on Earth. This function is a useful geospatial join tool.

Read more about [S2 cell hierarchy](https://s2geometry.io/devguide/s2cell_hierarchy).

## Syntax

`geo_line_to_s2cells(`*lineString*`,` *level*`)`

`geo_line_to_s2cells(`*lineString*`,` *level*`,` *radius*`)`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *lineString* | dynamic | &check; | Line or multiline in the [GeoJSON format](https://tools.ietf.org/html/rfc7946).|
| *level* | int | | Defines the requested cell level. Supported values are in the range [0, 30]. If unspecified, the default value `11` is used.|
| *radius* | real | | Buffer radius in meters. If unspecified, the default value `0` is used.|

## Returns

Array of S2 cell token strings that cover a line or a multiline. If radius is set to a positive value, then the covering will be, in addition to input shape, of all points within the radius of the input geometry. If line, level, radius is invalid, or the cell count exceeds the limit, the query will produce a null result.

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

 * If possible, reduce coordinates table size before join, by grouping coordinates that are very close to each other by using [geospatial clustering](geospatial-grid-systems.md) or by filtering out unnesessary coordinates due to nature of the data or business needs.
 * If possible, reduce lines count due to nature of the data or business needs. Filter out unnecessary lines before join, scope to the area of interest or unify lines.
 * In case of very big lines, reduce their size using [geo_line_simplify()](geo-line-simplify-function.md).
 * Changing S2 cell level may improve performance and memory consumption.
 * Changing [join kind and hint](joinoperator.md) may improve performance and memory consumption.
 * In case positive radius is set, reverting to radius 0 on buffered shape using [geo_line_buffer()](geo-line-buffer-function.md) may improve performance.

## Example

The following query finds all tube stations within 500 meters of famous streets.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA5VUy3KbMBTd8xUaNoUZ4kgYgXDqTZadLDqTZcbDKEi1FWPJA3IebfrvvZIAO8mqrKT7OPecI4lOWtRzoU4DWiOK8U3UQcSeHmUzWG6V0S4hOKz5YyeTy0yj+UGuBtsrvc1Qp7erXvIOVtyukFum0UOE4Ivv7QL9gOLhG/rJ+32cofG7wguyLCjBFaMlw7BmZYYoWRR1TWpSUEYZqfLMw6D4zmhhNLrtldhKNNIANIDBrKjziuakdChLVnkYigtWlUtSFgUGuBHn+hodTC+9zAlliDZBO+iR0n5UHWKf9CotV+INYqqdhd6e2j1kd/wAQjveSiA31iR/Yvt2lPEqvoPOe48SZ3FrTC+U5lYO8erhwRtS1yUtK8xytgQ1mddBasxwnheMUbrJfF2BGQOlbOl14yIUYpJDZ1WCeflm8zcNmj9aFw7gf4lhVhGahyk1rctAA0gsCxyiJSH4PHOyeXR0MvjJKN108ll24DEpQvAIQW/6h6sXcs5plzoAl17xTv2eTmRA70i+WqkFUgIqtHxpticlkjQNrb1v9Gw8il+9o2NvnmRroSlDrXmWTjLUbaVpXFljTTPkrey6IXH77IJzNj6XdIQ6PF/J1yMHBjOQNcgZan4l4a5MpQ4EwfUQa6W17NEOJC+gBGRt39aPveGi5YP11Uk0PZHgzLydBX/i7cvOxJPO31FuL7kHIimCezB130TOonfUGbM/HUerIa9ENE8SCs5Dt3KcNG3PI13XxUC3TaH9ZSfh9Ofu7+vRuuh8AF9+Jxm6eGvZ3PwP1BOCmacEAAA=" target="_blank">Run the query</a>

```kusto
let radius = 500;
let tube_stations = datatable(tube_station_name:string, lng:real, lat: real)
[
    "St. James' Park",        -0.13451078568013486, 51.49919145858172,
     "London Bridge station", -0.08492752160134387, 51.504876316440914,
     // more tube stations
];
let streets = datatable(street_name:string, line:dynamic)
[
    "Buckingham Palace", dynamic({"type":"LineString","coordinates":[[-0.1399656708283601,51.50190802248855],[-0.14088438832752104,51.50012082761452]]}),
    "London Bridge",    dynamic({"type":"LineString","coordinates":[[-0.087152,51.509596],[-0.088340,51.506110]]}),
    // more streets
];
let join_level = 14;
let points = tube_stations;
let lines = materialize(streets | extend id = new_guid());
let res = 
    lines
    | project id, covering = geo_line_to_s2cells(line, join_level, radius)
    | mv-expand covering to typeof(string)
    | join kind=inner hint.strategy=broadcast
    (
        points
        | extend covering = geo_point_to_s2cell(lng, lat, join_level)
    ) on covering;
res | lookup lines on id
| extend distance = geo_distance_point_to_line(lng, lat, line)
| where distance <= radius
| project tube_station_name, street_name, distance
```

|tube_station_name|street_name|distance|
|---|---|---|
|St. James' Park|Buckingham Palace|451.692474409721|
|London Bridge station|London Bridge|273.133133711648|


