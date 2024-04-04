---
title: Geospatial data visualizations
description: Learn how to visualize geospatial data.
ms.reviewer: mbrichko
ms.topic: reference
ms.date: 12/18/2022
---

# Geospatial visualizations

Geospatial data can be visualized using the [render operator](render-operator.md) in [Kusto Desktop Explorer](../tools/kusto-explorer-using.md) or the [Azure Data Explorer web UI](../../web-query-data.md). To download Kusto Desktop Explorer, see [Kusto.Explorer installation and user interface](../tools/kusto-explorer.md).

For more information about visualization options, see [Data visualization with Azure Data Explorer](../../viz-overview.md). For more information about geospatial clustering, see [Geospatial clustering](geospatial-grid-systems.md).

## Visualize points on a map

It's possible to visualize points either using [Longitude, Latitude] columns, or GeoJSON column. The use of a series column is optional. The [Longitude, Latitude] pair defines each point, in that order.

### Example: Visualize points on a map

The following example finds storm events and visualizes 100 on a map.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS%2FKdS1LzSsp5qpRKEnMTlUwNDAAMguK8rNSk0sUnFLTM%2FN88vN0oKzEEqBkUWpeSmqRQnFyYklJalFyRmJRiUJ5ZkmGgkZ2Zl6Kgq1CbmKBJgAmnyYWWwAAAA%3D%3D" target="_blank">Run the query</a>

```kusto
StormEvents
| take 100
| project BeginLon, BeginLat
| render scatterchart with (kind = map)
```

:::image type="content" source="media/geo-visualizations/storm-events-sample.png" alt-text="Screenshot of sample storm events on a map.":::

### Example: Visualize multiple series of points on a map

The following example visualizes multiple series of points, where the [Longitude, Latitude] pair defines each point, and a third column defines the series. In this example, the series is `EventType`.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS%2FKdS1LzSsp5qpRKEnMTlUwNDAAMguK8rNSk0sUnFLTM%2FN88vN0oKzEEh0FsPqQyoJUoLqi1LyU1CKF4uTEkpLUouSMxKIShfLMkgwFjezMvBQFW4XcxAJNAKZVk%2FhmAAAA" target="_blank">Run the query</a>

```kusto
StormEvents
| take 100
| project BeginLon, BeginLat, EventType
| render scatterchart with (kind = map)
```

:::image type="content" source="media/geo-visualizations/storm-events-series-sample.png" alt-text="Screenshot of sample storm series events on a map.":::

### Example: Visualize series of points on data with multiple columns

The following example visualizes a series of points on a map. If you have multiple columns in the result, you must specify the columns to be used for xcolumn (Longitude), ycolumn (Latitude), and series.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS%2FKdS1LzSsp5qpRKEnMTlUwNDAAMotS81JSixSKkxNLSlKLkjMSi0oUyjNLMhQ0sjPzUhRsFXITC3QUKpLzc0pz84Bcp9T0zDyf%2FDwdhUqIWDFcMLFER6E4tSgzFSQEtiuksiBVEwDmTUhSewAAAA%3D%3D" target="_blank">Run the query</a>
```kusto
StormEvents
| take 100
| render scatterchart with (kind = map, xcolumn = BeginLon, ycolumns = BeginLat, series = EventType)
```
<!--this image still needs to be replaced-->
:::image type="content" source="media/geo-visualizations/storm-events-series-sample.png" alt-text="Screenshot of sample storm series events using arguments.":::

### Example: Visualize points on a map defined by GeoJSON dynamic values

The following example visualizes points on the map using GeoJSON dynamic values to define the points.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA2WNsQoCMRBEe79iyzu4SrC8RrCz8wPCmlsu0WQ3bFZF8eO9cBaC3cDMe3My0Xy4E1vdvKGoXMgb7GmOfBQevgltKestZ9T4Ijg%2FIWAN40ziikQ2Z%2BLq1lNK3T86wK7%2FcTdo3TbKL8%2BKadV0zdq2SjyRQvVoRuoDqsEjWoDuGnmCETKW%2FgOAAdqguwAAAA%3D%3D" target="_blank">Run the query</a>
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

The following example shows storm events aggregated by S2 cell. The chart aggregates events in pie charts by location.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA22PsU7DMBCGd57ixhiZNmmhCkOXSp1ggz1ynVNi6tjW%2BdISxMNjt5XI0OlOuv%2F%2FPvuDPQ37EzqOD78QyH%2BhZthhZ9y7d%2FK2KZZwCX1OAVPu3CMhdOib4I3jxrhGG9IWi3tNQmWLp7parOvXSkhY1YuX9fNGQlWWJTzmIRI0jsOgyPwgaD86LgQcpn%2BrhF7FHrYzK%2FsmrjRae8cqZr%2FJjWswV3QCkrJXRpGhQs41F3mT6oSuRYJgUPeKGM6GeyiOxrXpFYMKApbLfM37LWxcB%2BqkjFUHi%2BCdncA4eBsje9h%2FB%2BspAVuMR%2FbhDzcwHP56AQAA" target="_blank">Run the query</a>
```kusto
StormEvents
| project BeginLon, BeginLat, EventType
| where geo_point_in_circle(BeginLon, BeginLat, real(-81.3891), 28.5346, 1000 * 100)
| summarize count() by EventType, hash = geo_point_to_s2cell(BeginLon, BeginLat)
| project geo_s2cell_to_central_point(hash), EventType, count_
| render piechart with (kind = map) // pie map rendering available only in Kusto Explorer desktop
```

:::image type="content" source="media/geo-visualizations/storm-events-pie.png" alt-text="Screenshot of storm events on a pie map.":::

### Example: Visualize bubbles using a color axis

The following example shows storm events aggregated by S2 cell. The chart aggregates events in bubble by location. Since the color-axis ("count") is the same for all events, the `render` operator generates bubbles.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA22PPW%2FCMBCG9%2F6KE1NSpZBAqdKBpRJTu7V7ZMwpueL4LPsCpOqPrx2QysB0p3s%2FHvtT2PfbI1oJD7%2FgPH%2BjFnjDluwH2%2BK6KSlgMn2NDqPv1KFHaJEbx2SlIdto8tpgdi%2FpUZnsqa7mq%2Fq1ygtY1vP16vmlgKosS3hMI4%2BlYeh75ekHQfNgJcthN%2F5TC%2BhU6GBzQxVuwlKjMXeo%2Bc1vUuJiTBEdC70yl44slcYnTcQmZvAsaPcXbIi02aTMouLjHT04Qt0pL3Ai6SA7UHRvoFcuh8UiqWm%2Fmsm2oI6KjNoZBLZmBLLwPgRh2J6dYR8L9xgOwu4PYF0r54kBAAA%3D" target="_blank">Run the query</a>
```kusto
StormEvents
| project BeginLon, BeginLat, EventType
| where geo_point_in_circle(BeginLon, BeginLat, real(-81.3891), 28.5346, 1000 * 100)
| summarize count() by EventType, hash = geo_point_to_s2cell(BeginLon, BeginLat)
| project geo_s2cell_to_central_point(hash), count_
| extend Events = "count"
| render piechart with (kind = map) // pie map rendering available only in Kusto Explorer desktop
```

:::image type="content" source="media/geo-visualizations/storm-events-bubble.png" alt-text="Screenshot of storm events on a bubble map.":::

## Related content

* [Geospatial clustering](geospatial-grid-systems.md)
* [Render operator](render-operator.md)
* [Data analytics for automotive test fleets](/azure/architecture/industries/automotive/automotive-telemetry-analytics) (geospatial clustering use case)
* Learn about Azure architecture for [geospatial data processing and analytics](/azure/architecture/example-scenario/data/geospatial-data-processing-analytics-azure)
