---
title:  geo_line_interpolate_point()
description: Learn how to use the geo_line_interpolate_point() function to calculate a point at fraction on a line on Earth.
ms.reviewer: mbrichko
ms.topic: reference
ms.date: 04/09/2025
---
# geo_line_interpolate_point()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculates a point at fraction value on a line on Earth.

## Syntax

`geo_line_interpolate_point(`*lineString*`,`*fraction*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *lineString* | `dynamic` |  :heavy_check_mark: | A LineString in the [GeoJSON format](https://tools.ietf.org/html/rfc7946).|
| *fraction* | `real` |  :heavy_check_mark: | fraction value should be between 0 (start of the line) and 1 (end of the line).|

## Returns

The point coordinate value in [GeoJSON Format](https://tools.ietf.org/html/rfc7946) and of a [dynamic](scalar-data-types/dynamic.md) data type on line string at the specific fraction value. If the line or fraction value is invalid, the query produces a null result.

> [!NOTE]
>
> * The geospatial coordinates are interpreted as represented by the [WGS-84](https://earth-info.nga.mil/index.php?dir=wgs84&action=wgs84) coordinate reference system.
> * The [geodetic datum](https://en.wikipedia.org/wiki/Geodetic_datum) used to measure distance on Earth is a sphere. Line edges are [geodesics](https://en.wikipedia.org/wiki/Geodesic) on the sphere.
> * If input line edges are straight cartesian lines, consider using [geo_line_densify()](geo-line-densify-function.md) in order to convert planar edges to geodesics.
> * The input should not contain more than a single line string.
> * In order to calculate a fraction value use [geo_line_locate_point()](geo-line-locate-point-function.md)

**LineString definition and constraints**

dynamic({"type": "LineString","coordinates": [[lng_1,lat_1], [lng_2,lat_2], ..., [lng_N,lat_N]]})

* LineString coordinates array must contain at least two entries.
* Coordinates [longitude, latitude] must be valid where longitude is a real number in the range [-180, +180] and latitude is a real number in the range [-90, +90].
* Edge length must be less than 180 degrees. The shortest edge between the two vertices is chosen.

## Examples

The following example calculates a point at 25% location since line start.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAyXNvQqDMBSG4b3QezhkUkgl1Zj4Q%2B%2BgW0cRET1IIM0JaRYpvffGdvye4XstRrDGIdxg3d38NEv2ZnH3yDp2T%2F6IwbiNcbYQhdW4OeKLdcNw0VXR1rpVHKQoGiFkOXL4s66u%2BsdaSdmocfzk%2Ffnk01GEBV0MZNbU25CmIz0lx%2BDJpu%2FJU1rZwRxEUdZ5%2FwX9yYzsogAAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
let line = dynamic({"type":"LineString","coordinates":[[-73.95796, 40.80042], [-73.97317, 40.764486]]});
print point = geo_line_interpolate_point(line, 0.25);
```

**Output**

|point|
|---|
|{"type": "Point", "coordinates": [-73.961764043218281, 40.791436687257232]}|

The following example calculates point longitude at 90% since line start.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA02Qz2rDMAzG74W%2Bg%2FGphSxI%2FiPLHX2D3XYMIZTWhJQsDlkuZdu7T0nomA%2BGT%2F75k%2FT1aVZ9NyR1VrfHcPnorocvPT%2FGpE%2F6Terv89QNrS70Nefp1g2XOX3qU1W9BFtGzxAMkbHeelM4KBnAGULnkKJFXxcb5yIRGu%2BYDePChUgRg0eQ4%2F%2BwYDEwk3h5G1eMnFu0mIG17smxQRDGo6HoNy4wkQgEY%2FCJkQxDgRiZHW9dGThA8NZEW9c%2Fx9f9bpT1ZjXm5T6rNuVmSaMRmaYx97Jusz4elnKhoIzH%2Fe5bjVO%2Bp6tEN7TybSXKfwlVUP8C6duaylkBAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
let line = dynamic({"type":"LineString","coordinates":[[-73.95807266235352,40.800426144169315],[-73.94966125488281,40.79691751000055],[-73.97317886352539,40.764486356930334],[-73.98210525512695,40.76786669510221],[-73.96004676818848,40.7980870753293]]});
print point = geo_line_interpolate_point(line, 0.9)
| project lng = point.coordinates[0]
```

**Output**

|result|
|---|
|-73.96556545832799|

The following example visualizes point on a map.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAz2Qy2rDMBBF94H8g9DKBtdo9BiNUvIH3XUZjDG2SEQc2yiCEtr%2Be%2BWYdBYDd%2BZw5zH6xMYweXZkw2PqbqEvvnl6LJ4f%2BEeuf6YYpjOveD%2FPcQhTl%2FydH06nN6tqZ0hYiSiVUUZWWtQkhJYIWgM6BaapNk47RJBGE0mClbMOHVgDIof5x6wCS4TZyyj3xFDrVWczoZR%2BcSRBZMaARGc2zhJiFiCkhBeGeRm0SECkaZtKgqywRkmnmua3fN%2FvlnxeYsu85iM7%2B7ldv9Fm6eMyj%2Fnc9tks1nLFRO3K%2Fe6HRT8NPrJ736UM9pcuJvYV0oUV1zAN2enWLeUfnlwQM1wBAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
let line = dynamic({"type":"LineString","coordinates":[[-73.95807266235352,40.800426144169315],[-73.94966125488281,40.79691751000055],[-73.97317886352539,40.764486356930334],[-73.98210525512695,40.76786669510221],[-73.96004676818848,40.7980870753293]]});
print point = geo_line_interpolate_point(line, 0.9)
| render scatterchart with (kind = map)
```

:::image type="content" source="media/geo-line-interpolate-point-function/line_interpolate_point.png" alt-text="Screenshot of an interpolated point at the New York City Central Park.":::

The following example returns `true` because of the invalid line.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUcgsjk9KTInPycxLVbAF8vJKc3I00lPzwSLxQBWpRQX5OYklqfEF%2BUCeRkplXmJuZrJGtVJJZUGqkpWSD1BdcAnQrHQlHaXk%2FPyilMw8oPJiJavoaEMdBcPY2FpNHQUDPVNNTQDRyYYgcgAAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
print is_bad_line = isnull(geo_line_interpolate_point(dynamic({"type":"LineString","coordinates":[[1, 1]]}), 0.5))
```

**Output**

|is_bad_line|
|---|
|true|
