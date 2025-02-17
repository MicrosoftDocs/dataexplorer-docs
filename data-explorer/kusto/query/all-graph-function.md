---
title: all() (graph function)
description: Learn how to use the all() function to evaluate a condition over the elements of a variable length edge.
ms.reviewer: michalfaktor
ms.topic: reference
ms.date: 02/17/2025
---
# all() (graph function)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

The `all()` graph function evaluates a condition for each *edge* and *inner node* along a [variable length](graph-match-operator.md#variable-length-edge) path.

> [!NOTE]
> This function is used with the [graph-match](graph-match-operator.md) and [graph-shortest-paths](graph-shortest-paths-operator.md) operators.

## Syntax

`all(`*edge*`,` *condition*`)`

`all(inner_nodes(`*edge*`),` *condition*`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *edge* | `string` |  :heavy_check_mark: | A variable length edge from the [graph-match operator](graph-match-operator.md) or [graph-shortest-paths operator](graph-shortest-paths-operator.md) pattern. For more information, see [Graph pattern notation](graph-match-operator.md#graph-pattern-notation). |
| *condition* | `string` |  :heavy_check_mark: | A Boolean expression composed of properties of the *edge* or *inner node*, when [inner_nodes](inner_nodes-graph-function.md) is used, in the [variable length edge](./graph-match-operator.md#variable-length-edge). A property is referenced using the property name directly. The expression is evaluated for each *edge* and *inner node* in the [variable length edge](./graph-match-operator.md#variable-length-edge). |

## Returns

Returns `true` if the condition evaluates to `true` for each  *edge* or *inner node*, when [inner_nodes](inner_nodes-graph-function.md) is used, in the [variable length edge](graph-match-operator.md#variable-length-edge). Otherwise, it returns `false`.

For zero length paths, the condition evaluates to `true`.

## Examples

The examples in this section show how to use the syntax to help you get started.

### Find all round-trip paths between two train stations using different lines for each direction

The following example shows how to use the `graph-match` operator with the `all()` function to find all round-trip paths between two stations in a transportation network. It uses a different line for each direction. The query constructs a graph from the `connections` data, finding all paths up to five connections long that use the `"red"` line for the outward route, and the `"blue"` line for the return route. The `all()` function ensures that all edges in the variable length edge are part of the same line, either `"red"` or `"blue"`.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA41SPU%2FDMBDd8yuOTAmKKzGwgJIFsbIwMFRV5MamMU3s6nJVhcSPx7GT1KZFkCz2%2B7h3PruTBI3RWjakjB6gBMHJ%2FttOZu9o%2BnqwO8s8DIRK7wogcwF1Sstpk0OyhgQgfZKakHdpAemLQWrHBUqRFiO5IIHKkT%2Btr%2BbohCE9Y4HuKu0W7E0OFJeP8UX%2Bm%2BCyQGS9EhD0%2F8w9ue2OcmJnKFAFbIDOhT0bBl9Yk80jJOEtJl%2FQ871kO%2BSHFsJ7BMaq4A7hpKittRGyVqKcQOt2RtZzalrILIyUs7U974mjuL1bre43rMqE7UdpZ7EsSjqiXkhvsm2fWokS3HY1p97YZ3Y2LzDXYpyC%2F3jXZVOif2JQln7M%2BSiMdD47kLm55GOxA5oPOxY3BPu6oz6KcxrAlDVPZnBibDjVHJF%2FZj0%2FZMqOGN24hrm3vIDJYVcpq9I8qkoGrp41Evn2%2F53s5X8Eb3mzL6PTfgN3g5IK6wMAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
let connections = datatable(from_station:string, to_station:string, line:string) 
[ 
  "Central", "North", "red",
  "North", "Central", "red", 
  "Central", "South",  "red", 
  "South", "Central",  "red", 
  "South", "South-West", "red", 
  "South-West", "South", "red", 
  "South-West", "West", "red", 
  "West", "South-West", "red", 
  "Central", "East", "blue", 
  "East", "Central", "blue", 
  "Central", "West", "blue",
  "West", "Central", "blue",
]; 
connections 
| make-graph from_station --> to_station with_node_id=station
| graph-match (start)-[outward*1..5]->(destination)-[return*1..5]->(start)
  where start.station != destination.station and 
        all(outward, line == "red") and
        all(return, line == "blue") 
  project from = start.station, 
          outward_stations = strcat_array(map(inner_nodes(outward), station), "->"), 
          to = destination.station, 
          return_stations = strcat_array(map(inner_nodes(return), station), "->"), 
          back=start.station
```

**Output**

|from|outward_stations|to|return_stations|back|
|---|---|---|---|---|
|Central|North->Central->South->South-West|West||Central|
|West|South-West->South->Central->North|Central||West|
|Central|South->South-West|West||Central|
|West|South-West->South|Central||West|
|Central|North->Central->South->South-West|West|Central->East|Central|
|West|South-West->South->Central->North|Central|East->Central|West|
|Central|South->South-West|West|Central->East|Central|
|West|South-West->South|Central|East->Central|West|

### Find the shortest path between two stations with Wi-Fi available

The following example shows how to use the `graph-shortest-paths` operator  with the `all()` and `inner_nodes` functions to find a path between two stations in a transportation network. The query constructs a graph from the `connections` data and finds the shortest path from the `"South-West"` station to the `"North"` station, passing through stations where Wi-Fi is available.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA31SPU%2FDMBDd8ytOmRIUd0BiKWoXxMrCwFBVldu4jcG1I%2BeqCokfz8X56DkpJIv97r37ejYK4eCsVQfUzjawglIi%2FXujsqN3511DN4osG%2FTangpAN4OMtqq%2F5JBsIAFIX5RFL01aQPrmPFbtwasyLdrgiDBWCE6l7%2B4SiDw8YIx3NxwO4kM1GKeP8ZH%2BF2GeIJLeKcD6f5VdcG8uqo8OEGOxKEOHxF2UF55Jk%2B0zJIac7J2JbZzaddVHvYS9c%2BaOW%2BgvKvLoKE3TIcOqJsiwgVE5vfcTBxl1mvDnlvzAWX4pcfKyroA%2FOBBizR4bdY3VbT4C%2BjNlCGLRVNQxlRa1xKqBdmyPudiwcg%2BPi8XTVqyzknjaBn1OLV4r5RUEwWKot1pF84G0JTG7j8kjfrezlgojVxqTaerA76wjXcbayTsv2g5q7z4JDRsg86JWilsy4A6TnweJO%2Bm9%2FM7Osv6nTK%2BiUyrWaR5lRNe%2BlvlEv327CZEaBAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
let connections = datatable(from_station:string, to_station:string, line:string) 
[ 
  "Central", "North", "red",
  "North", "Central", "red", 
  "Central", "South",  "red", 
  "South", "Central",  "red", 
  "South", "South-West", "red", 
  "South-West", "South", "red", 
  "South-West", "West", "red", 
  "West", "South-West", "red", 
  "Central", "East", "blue", 
  "East", "Central", "blue", 
  "Central", "West", "blue",
  "West", "Central", "blue",
]; 
let stations = datatable(station:string, wifi: bool) 
[ 
  "Central", true,
  "North", false,
  "South", false,
  "South-West", true,
  "West", true,
  "East", false
];
connections 
| make-graph from_station --> to_station with stations on station
| graph-shortest-paths (start)-[connections*2..5]->(destination)
  where start.station == "South-West" and
        destination.station == "North" and 
        all(inner_nodes(connections), wifi)
  project from = start.station, 
          stations = strcat_array(map(inner_nodes(connections), station), "->"), 
          to = destination.station
```

**Output**

|from|stations|to|
|---|---|---|
|South-West|West->Central|North|

## Related content

* [Graph operators](graph-operators.md)
* [graph-match operator](graph-match-operator.md)
* [graph-shortest-paths operator](graph-shortest-paths-operator.md)
* [inner_nodes()](inner_nodes-graph-function.md)
