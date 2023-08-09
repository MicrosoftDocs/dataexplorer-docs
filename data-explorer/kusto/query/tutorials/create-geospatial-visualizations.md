---
title:  'Tutorial: Create geospatial visualizations'
description: This tutorial gives examples of geospatial visualizations in the Kusto Query Language.
ms.topic: tutorial
ms.date: 08/09/2023
---

# Tutorial: Create geospatial visualizations

This tutorial is for those who want to use [Kusto Query Language (KQL)](../index.md) for geospatial visualization. Geospatial clustering is a way to organize and analyze data based on geographical location. KQL offers multiple methods for performing [geospatial clustering](../geospatial-grid-systems.md) and tools for [geospatial visualizations](../geospatial-visualizations.md).

In this tutorial, you'll learn how to:

> [!div class="checklist"]
>
> * [Plot points on a map](#plot-points-on-a-map)
> * [Plot multiple series of points](#plot-multiple-series-of-points)
> * [Use GeoJSON values to plot points on a map](#use-geojson-values-to-plot-points-on-a-map)
> * [Represent data points with variable-sized bubbles](#represent-data-points-with-variable-sized-bubbles)
> * [Display points within a specific area](#display-points-within-a-specific-area)
> * [Show nearby points on a LineString](#show-nearby-points-on-a-linestring)
> * [Show nearby points in a polygon](#show-nearby-points-in-a-polygon)
> * [Find anomalies based on geospatial data](#find-anomalies-based-on-geospatial-data)

## Plot points on a map

To visualize points on a map, use [project](../projectoperator.md) to select the column containing the longitude and then the column containing the latitude. Then, use [render](../renderoperator.md) to see your results in a scatter chart with `kind` set to `map`.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKEnMTlUwNDAAMguK8rNSk0sUnFLTM/N88vN0oKzEEqBkUWpeSmqRQnFyYklJalFyRmJRiUJ5ZkmGgkZ2Zl6Kgq1CbmKBJgAmnyYWWwAAAA==" target="_blank">Run the query</a>

```kusto
StormEvents
| take 100
| project BeginLon, BeginLat
| render scatterchart with (kind = map)
```

:::image type="content" source="../images/kql-tutorials/geospatial-storm-events-scatterchart.png" alt-text="Screenshot of sample storm events on a map.":::

## Plot multiple series of points

To visualize multiple series of points, use [project](../projectoperator.md) to select the longitude and latitude along with a third column, which defines the series.

In the following query, the series is `EventType`. The points are colored differently according to their `EventType`, and when selected display the content of the `EventType` column.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKEnMTlUwNDAAMguK8rNSk0sUnFLTM/N88vN0oKzEEh0FsPqQyoJUoLqi1LyU1CKF4uTEkpLUouSMxKIShfLMkgwFjezMvBQFW4XcxAJNAKZVk/hmAAAA" target="_blank">Run the query</a>

```kusto
StormEvents
| take 100
| project BeginLon, BeginLat, EventType
| render scatterchart with (kind = map)
```

:::image type="content" source="../images/kql-tutorials/geospatial-storm-events-by-type.png" alt-text="Screenshot of sample storm events on a map by type.":::

You may also explicitly specify the `xcolumn` (Longitude), `ycolumn` (Latitude), and `series` when performing the `render`. This specification is necessary when there are more columns in the result than just the longitude, latitude, and series columns.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKEnMTlUwNDAAMotS81JSixSKkxNLSlKLkjMSi0oUyjNLMhQ0sjPzUhRsFXITC3QUKpLzc0pz84Bcp9T0zDyf/DwdhUqIWDFcMLFER6E4tSgzFSQEtiuksiBVEwDmTUhSewAAAA==" target="_blank">Run the query</a>

```kusto
StormEvents
| take 100
| render scatterchart with (kind = map, xcolumn = BeginLon, ycolumns = BeginLat, series = EventType)
```

## Use GeoJSON values to plot points on a map

A dynamic GeoJSON value can change or be updated and are often used for real-time mapping applications. Mapping points using dynamic GeoJSON values allows for more flexibility and control over the representation of the data on the map that may not be possible with plain latitude and longitude values.

The following query uses the [geo_point_to_s2cell](../geo-point-to-s2cell-function.md) and [geo_s2cell_to_central_point](../geo-s2cell-to-central-point-function.md) to map storm events in a scatter chart.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA33OvQrCQBAE4N6n2DKBICpYphHs7CwlhPWy5E7vJ+ytiuLDe5dYBAS7hZ1vmKMEdvs7eYmLNwwcLqQEdtQbfwi++l4o6RlvziGbF8H5CRqjrnsK7RCMl1ZCGzeKrC1+aQXbctY9Aqgh48lkrdICRjvVFbl9bqzvk0hTCW0xRpYqBO6MR6F4WjVlBRblX2bd5EIm3xFDVChCrDSywMOIhuJqfJe8w6H8ABkqA1kUAQAA" target="_blank">Run the query</a>

```kusto
StormEvents
| project BeginLon, BeginLat
| summarize by hash=geo_point_to_s2cell(BeginLon, BeginLat, 5)
| project point = geo_s2cell_to_central_point(hash)
| project lng = toreal(point.coordinates[0]), lat = toreal(point.coordinates[1])
| render scatterchart with (kind = map)
```

:::image type="content" source="../images/kql-tutorials/geospatial-storm-events-centered.png" alt-text="Screenshot of sample storm events displayed using geojson.":::

## Represent data points with variable-sized bubbles

Visualize the distribution of data points by performing an aggregation in each cluster and then plotting the central point of the cluster.

For example, the following query filters for all storm events of the "Tornado" event type. It then groups the events into clusters based on their longitude and latitude, counts the number of events in each cluster, and projects the central point of the cluster, and renders a map to visualize the result. The regions with the most tornados become clearly detected based on their large bubble size.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA2VQsU7DQAzd+QorU07KhFhvqdSNje7RcbV6B4l98jktQXw8TtJCEZuf/d7zs1+UZdyfkbQ+fMEloSCs8DAXBO+hObBQOHJj4yL8hlFhh6dMz0zdtQr6o82VWGkahvY2chDo+K/P5ExTp3EMkj8RIk+k/YZnv6LWwesMKdQEHk7IfeFsHOW+Pka8c/qN0cGTu8u5iDbuoop2lYRhs2kXX9f93WtS/FC0uNtHbG+zEpbjxfooUDLGFEThkjVB+56N7WEMxX0DtXW+QEsBAAA=" target="_blank">Run the query</a>

```kusto
StormEvents
| where EventType == "Tornado"
| project BeginLon, BeginLat
| where isnotnull(BeginLat) and isnotnull(BeginLon)
| summarize count_summary=count() by hash = geo_point_to_s2cell(BeginLon, BeginLat, 4)
| project geo_s2cell_to_central_point(hash), count_summary
| extend Events = "count"
| render piechart with (kind = map)
```

:::image type="content" source="../images/kql-tutorials/tornado-geospatial-map.png" alt-text="Screenshot of Azure Data Explorer web UI showing a geospatial map of tornado storms.":::

## Display points within a specific area


Use a polygon to define the region and the [geo_point_in_polygon](../geo-point-in-polygon-function.md) function to filter for events that occur within that region.

The following query defines a polygon representing the southern California region and filters for storm events within this region. It then groups the events into clusters, counts the number of events in each cluster, projects the central point of the cluster, and renders a map to visualize the clusters.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA21QTU+EQAy98yuaOUGCm+wqiavZi4k3DyYeCSHj0IVRmJKZ4oof/90CiR+ROfW17/W9TosMgQZu0LvS6NYeyTur4QDV6HRnTfwegTzFY4/qCtQ9tWNNTqVL2xD5yjrNGGSa5/nZdrvfZCmcX2yyIoUJZ6t49433q3jiF7NJ8ZlcRw9Mvrt9Qcch+oCT5EWokcqerOPSOinmYPEN1tbdkUthqTSnaxcmsqX39ISG4b9EhmHoOu3tG4KhQSwWPMrPzDhO4HGERodGOj9BmMqwM9i2qzkuf7tOooU7qYxc5nW7rImnvUn611mk+MroKli+QXzVTFAy8dJHD71F02jPcLLcQPxshX2ATvfJF6/vcb7pAQAA" target="_blank">Run the query</a>

```kusto
let southern_california = dynamic({
    "type": "Polygon",
    "coordinates": [[[-119.5, 34.5], [-115.5, 34.5], [-115.5, 32.5], [-119.5, 32.5], [-119.5, 34.5]]
    ]});
StormEvents
| where geo_point_in_polygon(BeginLon, BeginLat, southern_california)
| project BeginLon, BeginLat
| summarize count_summary = count() by hash = geo_point_to_s2cell(BeginLon, BeginLat, 8)
| project geo_s2cell_to_central_point(hash), count_summary
| extend Events = "count"
| render piechart with (kind = map)
```

:::image type="content" source="../images/kql-tutorials/geospatial-southern-california-polygon.png" alt-text="Screenshot of Azure Data Explorer web UI showing a geospatial map of southern California storms.":::

## Show nearby points on a LineString

The following query finds nearby storm events that occur along a specified LineString, which represents a defined path. In this case, the LineString is a road to Key West. The [geo_distance_point_to_line()](../geo-distance-point-to-line-function.md) function is used to filter the storm events based on their proximity to the defined LineString. If an event is within 500 meters from LineString, the event is rendered on a map.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA5WUTWvcMBCG7wv7H4RPa3CMPmZGUtpcCj21twZ6KGExtthVmpUWWzQsbf97ZwNpusShWDpJIz169c4wD6GIMXfDbf4UTl/DVMSNGE6pO8R+83O9qsrpGKrr6iEmjo0x7aqGd/ucxyGmroSpuv62Xom/42IhxJVTrfXIE6wmJI3N5QENLRKQksZJZcnhv+G75j9oBgM678DYGTBpKwEs05GktsvIWhmpNHk0ak40EXlHxvE5fsYsYhsklGTAvmEIEYCXIK3SoGEZWhsEa8hoNy8bLNvMkslIQ7SALVsnvTeE2sy77dgJ4/lvDojkErclZ0qC1m/L9pwESwrQOMBlqo11VhsFMJtIbJVFpYiDpLn+lrgtW9ZM/F20ktkww/YaFeNReYVLaoTRThr20Xpyr83GFuipgJQDa/FS9Mvi7nf9br36UvJ4+PgjpDKtV7/E4z6MQcQp5RIOx3LafAi7mD53pRZdGl4HcqrP145jvg99Ec+bjXi+14gn+C03ihf+LuTtEKfSpT5sjzmmsi15e+4imznCRQeqxXuBUp5hY0hDGMXUd6WEsd93YxGPsezF5ntMw82hO9Z/AMXFbiXBBAAA" target="_blank">Run the query</a>

```kusto
let roadToKeyWest = dynamic({
"type":"linestring",
"coordinates":[
          [
            -81.79595947265625,
            24.56461038017685
          ],
          [
            -81.595458984375,
            24.627044746156027
          ],
          [
            -81.52130126953125,
            24.666986385216273
          ],
          [
            -81.35650634765625,
            24.66449040712424
          ],
          [
            -81.32354736328125,
            24.647017162630366
          ],
          [
            -80.8099365234375,
            24.821639356846607
          ],
          [
            -80.62042236328125,
            24.93127614538456
          ],
          [
            -80.37872314453125,
            25.175116531621764
          ],
          [
            -80.42266845703124,
            25.19251511519153
          ],
          [
            -80.4803466796875,
            25.46063471847754
          ]
        ]});
StormEvents
| where isnotempty(BeginLat) and isnotempty(BeginLon)
| project BeginLon, BeginLat, EventType
| where geo_distance_point_to_line(BeginLon, BeginLat, roadToKeyWest) < 500
| render scatterchart with (kind=map)
```

:::image type="content" source="../images/kql-tutorials/geospatial-distance-from-linestring.png" alt-text="Screenshot of the result of the previous KQL query to calculate events along a LineString." lightbox="../images/kql-tutorials/geospatial-distance-from-linestring.png":::

## Show nearby points in a polygon

The following query finds nearby storm events that occur within a specified polygon. In this case, the polygon is a road to Key West. The [geo_distance_point_to_polygon()](../geo-distance-point-to-polygon-function.md) function is used to filter the storm events based on their proximity to the defined polygon. If an event is within 500 meters of the polygon, the event is rendered on a map.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA6WUUY/TMAyA3yftP0R9WqVSJbGT2Af3gsQTvHESD+g0VW20FW5J1UacKuC/kyEOblxPYiNvdmx/duz4zicxxqa7iW/9/MFPSVyLbg7NoW83X9erIs2DL66KId7NuxiKKqvaGMeuD03yU3H1cb0Sv8+J8EQU4gXJWpKWrDUZZaw21d8m2tTASjnWpKwzBKcGt9U/IJAVAEjpSC0TjHLWONTMjBLMBQiTE9RgIWepkZcY6ByzBi0ziJQ7m6FrReS0dBIWq8A60yWQQjZsic+vIhMYtQKyTpFbRBhwSjMwy1zM+a3IBFASNZJE+wwClVaYeyVtnghNZzNUfWwBEFskhGcYuQx0ZJU9Dt0l7SaHFsARy8WhxdodnxLZ6ZwJkr2A8Z8f47H4SLj9Xr5cr96nOB7efPEhTevVN3G/96MX/RRi8ochzZvXfteHd00qRRO6pxcxlEe3YYyffJvEg7ISD36V+Bn8Ji+LP/F3Pm67fkpNaP12iH1I2xS3vzbJZinIySIqxSthpDzGG33o/CimtknJj+2+GZO479NebD73obs+NEP5A2AQjgzIBAAA" target="_blank">Run the query</a>

```kusto
let roadToKeyWest = dynamic({
"type":"polygon",
"coordinates":[
          [
            [
              -80.08209228515625,
              25.39117928167583
            ],
            [
              -80.4913330078125,
              25.517657429994035
            ],
            [
              -80.57922363281249,
              25.477992320574817
            ],
            [
              -82.188720703125,
              24.632038149596895
            ],
            [
              -82.1942138671875,
              24.53712939907993
            ],
            [
              -82.13104248046875,
              24.412140070651528
            ],
            [
              -81.81243896484375,
              24.43714786161562
            ],
            [
              -80.58746337890625,
              24.794214972389486
            ],
            [
              -80.08209228515625,
              25.39117928167583
            ]
          ]
        ]});
StormEvents
| where isnotempty(BeginLat) and isnotempty(BeginLon)
| project BeginLon, BeginLat, EventType
| where geo_distance_point_to_polygon(BeginLon, BeginLat, roadToKeyWest) < 500
| render scatterchart with (kind=map)
```

:::image type="content" source="../images/kql-tutorials/geospatial-distance-from-polygon.png" alt-text="Screenshot of the result of the previous KQL query to calculate events along a polygon." lightbox="../images/kql-tutorials/geospatial-distance-from-polygon.png":::

## Find anomalies based on geospatial data

The following query performs an analysis of storm events occurring within a particular state. The query uses S2 cells and temporal aggregation to investigate patterns of damage. The result is a visual anomaly chart that portrays any irregularities or deviations in storm-induced destruction over time, offering a detailed perspective on the affect of storms within the specified state boundaries.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA21SS0/CQBC+m/AfJpy2EQnhYozpQZGDiQ+S4rlZ26Gs7qPZHV7GH++UpQUJPe08vu+brzMaCQJJwvfFsyX0GAhS6M9xK0P/vnel2/rM6V3lLBcNR15JrX5Q9K6Av48sz5qeEMNfwC2hLcFKgwwgF8grW4kFSlqxxLD2rkZPip9vD6/TpMVtljzBAZaez9U2MfgLC4IKnUHyu7SjbTPJ6eATt8ZGPRsXqHWA9J+fc9Iwnhy6mCyvY1NOLg8RLlqNAdw1Mhk5b6ZrtMTmO+ORpSNRlo4U4hErZV+cHUB8SWq4GnS0fwArC+KSgZPOI7uy7awX6XkDhdTSi1PryZ7JyG+8CSyAAUppZNVsTK4r8bQPZnFTO7iGmJhwIiRQ4kKudHMrpVt9ahSj4SgBvg8+BE9zxRsMhDXclie/RVpn+G4wpFEwL7FwpnYB864k4hD72TyD0B9gu2LJzLBRtATRppxeGRvSDp38AaQv4EvQAgAA" target="_blank">Run the query</a>

```kusto
let stateOfInterest = "Texas";
let statePolygon = materialize(
    US_States
    | extend name = tostring(features.properties.NAME)
    | where name == stateOfInterest
    | project geometry=features.geometry);
let stateCoveringS2cells = statePolygon
    | project s2Cells = geo_polygon_to_s2cells(geometry, 9);
StormEvents
| extend s2Cell = geo_point_to_s2cell(BeginLon, BeginLat, 9)
| where s2Cell in (stateCoveringS2cells)
| where geo_point_in_polygon(BeginLon, BeginLat, toscalar(statePolygon))
| make-series damage = avg(DamageProperty + DamageCrops) default = double(0.0) on StartTime step 7d
| extend anomalies=series_decompose_anomalies(damage)
| render anomalychart with (anomalycolumns=anomalies)
```

:::image type="content" source="../images/kql-tutorials/geospatial-anomaly-chart.png" alt-text="Screenshot of the anomaly chart rendered by the previous KQL query." lightbox="../images/kql-tutorials/geospatial-anomaly-chart.png":::

## Next steps


* See a use case for geospatial clustering: [Data analytics for automotive test fleets](/azure/architecture/industries/automotive/automotive-telemetry-analytics)
* Learn about Azure architecture for [geospatial data processing and analytics](/azure/architecture/example-scenario/data/geospatial-data-processing-analytics-azure)
* Get a comprehensive understanding of Azure Data Explorer by reading the [white paper](https://azure.microsoft.com/mediahandler/files/resourcefiles/azure-data-explorer/Azure_Data_Explorer_white_paper.pdf)
