---
title: Geospatial data visualizations in Azure Data Explorer
description: Learn about how to visualize geospatial data with Azure Data Explorer.
ms.reviewer: mbrichko
ms.topic: reference
ms.date: 06/20/2022
---

# Geospatial visualizations

Geospatial data can be visualized using [render operator](renderoperator.md) in [Kusto Desktop Explorer](../tools/kusto-explorer-using.md) or [Web UI](../../web-query-data.md).

Overview of all visualization options can be found [here](../../viz-overview.md).

Please refer to [render operator](renderoperator.md) for all supported options.

## 1. Visualization of points on a map.

It's possible to visualize points either using [Longitude, Latitude] columns, in that order or GeoJSON column. Series column is optional.

### Examples:

Visualize points on a map. Each point defined by [Longitude, Latitude] pair.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| take 100
| project BeginLon, BeginLat
| render scatterchart with (kind = map)
```

:::image type="content" source="images/geo-visualizations/storm-events-sample.png" alt-text="Sample storm events on a map.":::

Visualize points series on a map. Each point is defined by [Longitude, Latitude] pair. Series defined by third column (EventType).

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| take 100
| project BeginLon, BeginLat, EventType
| render scatterchart with (kind = map)
```

:::image type="content" source="images/geo-visualizations/storm-events-series-sample.png" alt-text="Sample storm series events on a map.":::

Same as above, but due to multiple columns in the result we must specify xcolumn (Longitude), ycolumn (Latitude) and series.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| take 100
| render scatterchart with (kind = map, xcolumn = BeginLon, ycolumns = BeginLat, series = EventType)
```
:::image type="content" source="images/geo-visualizations/storm-events-series-sample.png" alt-text="Sample storm series events using arguments.":::

Visualize points on a map. Each point defined by GeoJSON dynamic type value.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| project BeginLon, BeginLat
| summarize by hash=geo_point_to_s2cell(BeginLon, BeginLat, 5)
| project geo_s2cell_to_central_point(hash)
| render scatterchart with (kind = map)
```
:::image type="content" source="images/geo-visualizations/storm-events-s2cell.png" alt-text="Sample storm GeoJSON events.":::

## 2. Visualization of pies\bubbles on a map.

It's possible to visualize pies\bubbles either using [Longitude, Latitude] columns, in that order or GeoJSON column, color-axis and numeric.

Show storm events aggregated by s2 cell. The chart aggregates events in pie by location.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| project BeginLon, BeginLat, EventType
| where geo_point_in_circle(BeginLon, BeginLat, real(-81.3891), 28.5346, 1000 * 100)
| summarize count() by EventType, hash = geo_point_to_s2cell(BeginLon, BeginLat)
| project geo_s2cell_to_central_point(hash), EventType, count_
| render piechart with (kind = map) // pie map rendering available in Kusto Explorer desktop
```

:::image type="content" source="images/geo-visualizations/storm-events-pie.png" alt-text="Storm events on a pie map.":::

Show storm events aggregated by s2 cell. The chart aggregates events in bubble by location. Color-axis ("count") is the same for all events, thus render generates bubbles. 

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| project BeginLon, BeginLat, EventType
| where geo_point_in_circle(BeginLon, BeginLat, real(-81.3891), 28.5346, 1000 * 100)
| summarize count() by EventType, hash = geo_point_to_s2cell(BeginLon, BeginLat)
| project geo_s2cell_to_central_point(hash), count_
| extend Events = "count"
| render piechart with (kind = map)
```

:::image type="content" source="images/geo-visualizations/storm-events-bubble.png" alt-text="Storm events on a bubble map.":::
