---
title: Geospatial data visualizations
description: Learn how to visualize geospatial data.
ms.reviewer: mbrichko
ms.topic: reference
ms.date: 02/26/2025
---

# Geospatial visualizations

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Geospatial data can be visualized as part of your query using the [render operator](render-operator.md) as [points](#example-visualize-points-on-a-map), [pies, or bubbles](#visualization-of-pies-or-bubbles-on-a-map) on a map.

For more information about geospatial clustering, see [Geospatial clustering](geospatial-grid-systems.md).

## Visualize points on a map

You can visualize points either using [Longitude, Latitude] columns, or GeoJSON column. Using a series column is optional. The [Longitude, Latitude] pair defines each point, in that order.

### Example: Visualize points on a map

The following example finds storm events and visualizes 100 on a map.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS%2FKdS1LzSsp5qpRKEnMTlUwNDAAMguK8rNSk0sUnFLTM%2FN88vN0oKzEEqBkUWpeSmqRQnFyYklJalFyRmJRiUJ5ZkmGgkZ2Zl6Kgq1CbmKBJgAmnyYWWwAAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| take 100
| project BeginLon, BeginLat
| render scatterchart with (kind = map)
```

:::image type="content" source="media/geo-visualizations/storm-events-sample.png" alt-text="Screenshot of sample storm events on a map.":::

### Example: Visualize multiple series of points on a map

The following example visualizes multiple series of points, where the [Longitude, Latitude] pair defines each point, and a third column defines the series. In this example, the series is `EventType`.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS%2FKdS1LzSsp5qpRKEnMTlUwNDAAMguK8rNSk0sUnFLTM%2FN88vN0oKzEEh0FsPqQyoJUoLqi1LyU1CKF4uTEkpLUouSMxKIShfLMkgwFjezMvBQFW4XcxAJNAKZVk%2FhmAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| take 100
| project BeginLon, BeginLat, EventType
| render scatterchart with (kind = map)
```

:::image type="content" source="media/geo-visualizations/storm-events-series-sample.png" alt-text="Screenshot of sample storm series events on a map.":::

### Example: Visualize series of points on data with multiple columns

The following example visualizes a series of points on a map. If you have multiple columns in the result, you must specify the columns to be used for xcolumn (Longitude), ycolumn (Latitude), and series.

> [!NOTE]
> The multiple columns visualization is only supported in [Kusto.Explorer](../tools/kusto-explorer.md).

```kusto
StormEvents
| take 100
| render scatterchart with (kind = map, xcolumn = BeginLon, ycolumns = BeginLat, series = EventType)
```

:::image type="content" source="media/geo-visualizations/storm-events-series-sample.png" alt-text="Screenshot of sample storm series events using arguments.":::

### Example: Visualize points on a map defined by GeoJSON dynamic values

The following example visualizes points on the map using GeoJSON dynamic values to define the points.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA2WNsQoCMRBEe79iyzu4SrC8RrCz8wPCmlsu0WQ3bFZF8eO9cBaC3cDMe3My0Xy4E1vdvKGoXMgb7GmOfBQevgltKestZ9T4Ijg%2FIWAN40ziikQ2Z%2BLq1lNK3T86wK7%2FcTdo3TbKL8%2BKadV0zdq2SjyRQvVoRuoDqsEjWoDuGnmCETKW%2FgOAAdqguwAAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| project BeginLon, BeginLat
| summarize by hash=geo_point_to_s2cell(BeginLon, BeginLat, 5)
| project geo_s2cell_to_central_point(hash)
| render scatterchart with (kind = map)
```

:::image type="content" source="media/geo-visualizations/storm-events-s2cell.png" alt-text="Screenshot of sample storm GeoJSON events.":::

## Visualization of pies or bubbles on a map

You can visualize pies or bubbles either using [Longitude, Latitude] columns, or GeoJSON column. These visualizations can be created with color or numeric axes.

### Example: Visualize pie charts by location

The following example shows storm events aggregated by S2 cells. The chart aggregates events in bubbles by location in one color.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA22PP08DMQzFdz6F1SlBobproTqGLpW6sbV7FILVBHJJ5Lj0j%2Fjw5O6Q6NDJlv3e%2B9k7TtRvvzFyefiBTOkTLcMGDz6%2Bpaj%2BOsMKRtH%2BkrHqTg4J4YBJ5%2BQjax%2B19WQDintOQhPEU9fOl91rKxUsuvnL8nmloG2aBh6HImtoOfa9IX9FsOkYWUh4v%2FxTFThTHKxvqJx0WVgM4Q5V3nwzOCbhYLE1kEyYMsQQWk8aibp68MwYPyZsqbTZuJnVDdU5EmSP1hliOHl2IL58Va%2BhN1n%2BAsxScyJLAQAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| project BeginLon, BeginLat, EventType
| where geo_point_in_circle(BeginLon, BeginLat, real(-81.3891), 28.5346, 1000 * 100)
| summarize count() by EventType, hash = geo_point_to_s2cell(BeginLon, BeginLat)
| project geo_s2cell_to_central_point(hash), count_
| extend Events = "count"
| render piechart with (kind = map)
```

:::image type="content" source="media/geo-visualizations/storm-events-bubble.png" alt-text="Screenshot of storm events on a bubble map.":::

### Example: Visualize bubbles using a color axis

The following example shows storm events aggregated by S2 cells. The chart aggregates events by event type in pie charts by location.

> [!NOTE]
> The color axis visualization is only supported in [Kusto.Explorer](../tools/kusto-explorer.md).

```kusto
StormEvents
| project BeginLon, BeginLat, EventType
| where geo_point_in_circle(BeginLon, BeginLat, real(-81.3891), 28.5346, 1000 * 100)
| summarize count() by EventType, hash = geo_point_to_s2cell(BeginLon, BeginLat)
| project geo_s2cell_to_central_point(hash), EventType, count_
| render piechart with (kind = map)
```

:::image type="content" source="media/geo-visualizations/storm-events-color-pie-map.png" alt-text="Screenshot of storm events on a pie map in Kusto.Explorer.":::

## Related content

* [Geospatial clustering](geospatial-grid-systems.md)
* [Render operator](render-operator.md)
* [Data analytics for automotive test fleets](/azure/architecture/industries/automotive/automotive-telemetry-analytics) (geospatial clustering use case)
* Learn about Azure architecture for [geospatial data processing and analytics](/azure/architecture/example-scenario/data/geospatial-data-processing-analytics-azure)
