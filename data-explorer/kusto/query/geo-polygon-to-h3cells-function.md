---
title:  geo_polygon_to_h3cells()
description: Learn how to use the geo_polygon_to_h3cells() function to calculate H3 cells for a polygon
ms.reviewer: mbrichko
ms.topic: reference
ms.date: 01/05/2024
---
# geo_polygon_to_h3cells()

Converts polygon to H3 cells. This function is a useful geospatial join and visualization tool.

## Syntax

`geo_polygon_to_h3cells(`*polygon* [`,` *resolution*[`,` *radius*]]`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *polygon* | `dynamic` |  :heavy_check_mark: | Polygon or multipolygon in the [GeoJSON format](https://tools.ietf.org/html/rfc7946).|
| *resolution* | `int` | | Defines the requested cell resolution. Supported values are in the range [0, 15]. If unspecified, the default value `6` is used.|
| *radius* | `real` | | Buffer radius in meters. If unspecified, the default value `0` is used.|

## Returns

Array of H3 cell token strings of the same resolution that represet a polygon or a multipolygon. If radius is set to a positive value, then the polygon will be enlarged such that all points within the given radius of the input polygon or multipolygon will be contained inside and the newly calculated polygon that will be converted to H3 cells. If polygon, resolution, radius is invalid, or the cell count exceeds the limit, the query will produce a null result.

> [!NOTE]
>
> * Converting polygon to H3 cell tokens can be useful in matching coordinates to polygons that might include these coordinates and matching polygons to polygons.
> * The maximum count of tokens per polygon is 61680.
> * Polygon edges are straight lines.
> * A polygon is represented by the cells whose centroids are inside the polygon. This means that the cells are not exactly the same as the polygon, but they get closer as the resolution increases. To make sure that every point in the polygon is covered by a cell, the polygon can be buffered. This also ensures that neighboring polygons that touch each other will have separate cells, so no cell will belong to more than one polygon.

Seel also [geo_polygon_to_s2cells()](geo-polygon-to-s2cells-function.md).

## Examples

The following example calculates H3 cells that approximate the polygon.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA03O0QqDIBTG8fs9hZyrAhcudWFj77B7CQmTCkyjvJGxd99KL3b5Pz8OfNYEtHobR%2B%2FQEw3R9cusizeEuBpo4ZUIMGjvt2F2fTA7tFLKK63uXGBGKs5ph48WN3o0IyJ1U59eN9l5zU5nJPXff9d9ysdl3WYX0ESVNtbuvz2j8SqvU8GriZ5Q5FP5BX4H5by9AAAA" target="_blank">Run the query</a>
```kusto
let polygon = dynamic({"type":"Polygon","coordinates":[[[-3.659,40.553],[-3.913,40.409],[-3.729,40.273],[-3.524,40.440],[-3.659,40.553]]]});
print h3_cells = geo_polygon_to_h3cells(polygon)
```

**Output**

|h3_cells|
|---|
|["86390cb57ffffff","86390cb0fffffff","86390ca27ffffff","86390cb87ffffff","86390cb07ffffff","86390ca2fffffff","86390ca37ffffff","86390cb17ffffff","86390cb1fffffff","86390cb8fffffff","86390cba7ffffff","86390ca07ffffff","86390cbafffffff"]|

The following example demonstrates a multipolygon that consists of H3 cells that approximate the above polygon. Specifing a higher resolution will improve polygon approximation.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA32Sy2rDMBBF9%2FmKQSsZnEdjuyEp%2FYRC9yGIqaw4amTJyEoa9%2FHvlWxjVGi7vLozZ%2B6IUcJBY1RXGQ2PUHYaa8npB3FdI8iOPA8WSQk3xpZSoxMt2e33%2B3m2uC%2B2ab5aFEV2SIPe3mVB56vtoDfr3l9vRr9Y572frwYd9R8OX8nDrLFSOzhljAulWp%2BnEoaN6Zgz7JT1Bh2fktkn1Ne5uDWoSwiWb5m6nYGwhDnS1nlulcByCeLmLHI3FPsKhFY0aP1WYM2b5zXWvAo%2B%2FQkbqSHIMD3kGE0adI%2FlRl%2BFdSCQnyL2WBdhpS7lVZYXVNNe0cf6QQ3yM0NrsaNxhEVUFdZuL3WNVr4LqC%2FKyd9ZNZ4FU7J19P%2BxSRQwxnnEC1YsRKLDQaTkKfjTVcCPs0j%2FDJN8A0ZsriFnAgAA" target="_blank">Run the query</a>
```kusto
let polygon = dynamic({"type":"Polygon","coordinates":[[[-3.659,40.553],[-3.913,40.409],[-3.729,40.273],[-3.524,40.440],[-3.659,40.553]]]});
print h3_cells = geo_polygon_to_h3cells(polygon)
| mv-expand cell = h3_cells to typeof(string) // extract cell to a separate row
| project polygon_cell = geo_h3cell_to_polygon(cell) // convert each cell to a polygon
| project individual_polygon_coordinates = pack_array(polygon_cell.coordinates)
| summarize multipolygon_coordinates = make_list(individual_polygon_coordinates)
| project multipolygon = bag_pack("type","MultiPolygon", "coordinates", multipolygon_coordinates)
```

**Output**

|multipolygon|
|---|
|{"type": "MultiPolygon",<br>  "coordinates": [ ... ]}|

The following example return null because the polygon is invalid.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAy2MMQrDMAwA977CaLLBQ0K3lP6huzEmOCIVqJaJ1cGU%2Fr0JzXbcwTGqqcJ9lWLuZullflG2H9BeESZ4%2FBN4yCLbQmVWbDCFEAY%2FRB9GP8YYv%2B52qRsVNdRSeTPvK2oH2BUlnf%2Bkkp7XjMzNnsq5HxKUVsiAAAAA" target="_blank">Run the query</a>
```kusto
let polygon = dynamic({"type":"Polygon","coordinates":[[[0,0],[1,1]]]});
print is_null = isnull(geo_polygon_to_h3cells(polygon))
```

**Output**

|is_null|
|---|
|True|
