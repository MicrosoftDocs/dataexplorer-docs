---
title: map() (graph function)
description: Learn how to use the map() function to evaluate an expression over the elements of a variable length edge.
ms.reviewer: michalfaktor
ms.topic: reference
ms.date: 02/27/2025
---
# map() (graph function)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

The `map()` graph function calculates an expression for each *edge* or *inner node* along a [variable length](graph-match-operator.md#variable-length-edge) path and returns a dynamic array of all results.

> [!NOTE]
> This function is used with the [graph-match](graph-match-operator.md) and [graph-shortest-paths](graph-shortest-paths-operator.md) operators.

## Syntax

`map`(`*edge*`,` *expression*`)`

`map(inner_nodes(`*edge*`),` *expression*`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *edge* | `string` |  :heavy_check_mark: | A variable length edge from the [graph-match operator](graph-match-operator.md) or [graph-shortest-paths operator](graph-shortest-paths-operator.md) pattern. For more information, see [Graph pattern notation](./graph-match-operator.md#graph-pattern-notation).|
| *expression* | `string` |  :heavy_check_mark: | The calculation to perform over the properties of the *edge* or *inner node*, when [inner_nodes](inner-nodes-graph-function.md) is used, in the [variable length edge](./graph-match-operator.md#variable-length-edge). A property is referenced using the property name directly. The expression is evaluated for each *edge* or *inner node* in the [variable length edge](./graph-match-operator.md#variable-length-edge). |

## Returns

A dynamic array where:

* The array length matches the number of edges or inner nodes, when [inner_nodes](inner-nodes-graph-function.md) is used, in the variable length edge.
* The array is empty for zero length paths.
* Each element in the array corresponds to the results of applying the *expression* to each edge or inner node in the variable length edge.

## Examples

The examples in this section show how to use the syntax to help you get started.

### Find the station and line for the shortest route between two stations

The following example shows how to use the `graph-shortest-paths` operator to find the shortest path between the `"South-West"` and `"North"` stations in a transportation network. It adds line information to the path using the `map()` function. The query constructs a graph from the `connections` data, considering paths up to five connections long.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA3VSvU7DMBDe8xQnTzGKIzGwgNIFsbIwMFRV5CamMSR2ZLvqwsNzcZJyJkVezt%2FP3dl3vQrQWGNUE7Q1HipoZcBz7FX%2B4exQe7wh8%2BiD0%2BZUQLAbqNdGLRcO2R4yAPasTHCyZwWwV%2BtCNwVOtayYyCtCVJH8a32z5yik9IoR3U06BuJd%2BZCmT%2FGr%2FD%2FBNkFivVGA9P8iZ%2FLYn9XCrhBREZaga%2BKZpYU31uzwBBmdYvYNg%2FxS4uTk2AGdIwixIzOEiw5dbWyrat1WC4juaBS%2Bw0FhUTHK0HnIkXeBiz0pdXdflg8Hsctb1GkT%2FRybvXTKKYiGcq1VVcmngTQtEFuim1cEE43OfmKt%2BAjcziRjAVNjiA5yzElTBcpcI0P%2B%2B1D8K8jZvKsYc8b5tMvTvm87%2BAFjHgo5FQMAAA%3D%3D" target="_blank">Run the query</a>
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
| graph-shortest-paths (start)-[connections*1..5]->(destination)
  where start.station == "South-West" and destination.station == "North"
  project from = start.station, path = map(connections, strcat(to_station, " (", line, ")")), to = destination.station
```

**Output**

from|path|to|
|---|---|---|
South-West|[<br>  "South (red)",<br>  "Central (red)",<br>  "North (red)"<br>]|North|

### Get list of stopovers with Wi-Fi in all routes between two stations

The following example shows how to use the `graph-match` operator with the `all()` and `inner_nodes` functions to find all stopovers with Wi-Fi along all routes between two stations in a transportation network.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA41SPW%2BDMBTc%2BRVPTLjCkTp0SUWWqmuXDh2iCDlggltjI%2BM0itQf32cHU0PSqrDYd%2B%2FufVlyC5VWildWaDVAATWz%2BO8lzxqju3LAGzLrwRqhDjlYfQVJofh4IZBsIQFIn7iyhsk0h%2FRFG9u6g%2BF1mjtyQqIoTy6lr%2FroA2M6YFHcTdof6Bsf7Nx%2Bjk%2FhvwVcG8ykNxJE9T%2BzC7mXRz6yAYqiIjZCg%2FGFjRNfSZPdIyQSNzluZr7G5bpOohHrvdbyxrKsOfLZihomhwsSJrVAwgAm5fI%2BNuxlWGgSv7bkCzr2wenBsL6F%2BL0BpZvorWHRtv1pD4HxjA5eTDtmqxaqcyX5UCitOLjGjSV0G2W8u1%2BtHnZ0k9VYpVDegmCVp5YbDl6wCimLYtYiMFVDJJvF%2BSbRpzf6HVOhk%2B71JzduEzj3itmSGcPOWcf6TGA5plQazbKoNpKHpvCU0k1K3PzCNzmWbhSlW6Lz5rYUyiKMJv82%2FztONE3m7CcFVpMSQr4BgxtWvisEAAA%3D" target="_blank">Run the query</a>
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
let stations = datatable(station:string, wifi:bool) 
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
| graph-match cycles=none (start)-[connections*1..5]->(destination)
  where start.station == "South-West" and destination.station == "East"
  project stopovers = strcat_array(map(inner_nodes(connections), station), "->"),
          stopovers_with_wifi = set_intersect(map(inner_nodes(connections), station), map(inner_nodes(connections), iff(wifi, station, "")))
```

**Output**

|stopovers|stopovers_with_wifi|
|---|---|
| West->Central  | [ "West", "Central"] |
| South->Central | [ "Central"] |

## Related content

* [Graph operators](graph-operators.md)
* [graph-match operator](graph-match-operator.md)
* [graph-shortest-paths operator](graph-shortest-paths-operator.md)
* [inner_nodes()](inner-nodes-graph-function.md)
