---
title: any() (graph function)
description: Learn how to use the any() function to evaluate a condition over the elements of a variable length edge.
ms.reviewer: michalfaktor
ms.topic: reference
ms.date: 03/09/2025
---
# any() (graph function)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

The `any()` graph function evaluates a condition for each *edge* or *inner node* along a [variable length](graph-match-operator.md#variable-length-edge) path.

> [!NOTE]
> This function is used with the [graph-match](graph-match-operator.md) and [graph-shortest-paths](graph-shortest-paths-operator.md) operators.

## Syntax

`any(`*edge*`,` *condition*`)`

`any(inner_nodes(`*edge*`),` *condition*`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *edge* | `string` |  :heavy_check_mark: | A variable length edge from the [graph-match operator](graph-match-operator.md) or [graph-shortest-paths operator](graph-shortest-paths-operator.md) pattern. For more information, see [Graph pattern notation](graph-match-operator.md#graph-pattern-notation). |
| *condition* | `string` |  :heavy_check_mark: | A Boolean expression composed of properties of the *edge* or *inner node*, when [inner_nodes](inner-nodes-graph-function.md) is used, in the [variable length edge](./graph-match-operator.md#variable-length-edge). A property is referenced using the property name directly. The expression is evaluated for each *edge* or *inner node* in the [variable length edge](./graph-match-operator.md#variable-length-edge). |

## Returns

Returns `true` if the condition evaluates to `true` for at least one *edge* or *inner node*, when [inner_nodes](inner-nodes-graph-function.md) is used, in the [variable length edge](graph-match-operator.md#variable-length-edge). Otherwise, it returns `false`.

For zero length paths, the condition evaluates to `false`.

## Examples

The following example uses the `Locations` and `Routes` data tables to construct a graph that finds paths from a source location to a destination location through a `route`. It uses `any()` function to find paths that uses `"Train"` transportation method at least once. It returns the source location name, destination location name and transportation methods along the route.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA31SYUvDMBD93l9x9FMr7Yp%2BVDaQDUGYE3QgIkNidrRxbVKSG2Pgjzfp7JZ2nfn43t27ey%2BXZTBXnJFQ0gCxrxIhkmqNJg5KJI8bw5oRayqiFl2wCm%2FBkBYyT461y319RGP4CMC%2BcIE7eFd6EyYQTgXtw%2BSAvzIJD5pJLgxXfXJaCM7yM3iuDNzLHEs0Z3LIiEp08BvTWKitwTBY3QVZBi9qS3g0ieu8NflH%2BA6ftciFbB09zk4uZ2hIyAYeopfWi6mVpicb4r8pnDlf6i3ftEY6eZ1isPJCXsyuF0xH0BPxQuro9dr9FTpSXv%2BACSfoEj%2BkGvxAxTaY5prVBfRjhTSdDCcKO0GFd35Kgn91VrZRTCtGvIDIaB6nH9qNvLoejW5W6SSyR0yx3XhXoEZgch81fO%2BPYDxut3bFtVbfyAms4MgfmEDj3T2ne4lrJnx2BrjDqlg9ODz%2BBXstkwN%2FAwAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
// Locations table (nodes)
let Locations = datatable(LocationName: string, LocationType: string) [
    "New York", "City",
    "San Francisco", "City",
    "Chicago", "City",
    "Los Angeles", "City",
    "Seattle", "Warehouse"
];
// Routes table (edges)
let Routes = datatable(OriginLocationID: string, DestinationLocationID: string, TransportMode: string) [
    "New York", "San Francisco", "Truck",
    "New York", "Chicago", "Train",
    "San Francisco", "Los Angeles", "Truck",
    "Chicago", "Seattle", "Train",
    "Los Angeles", "New York", "Truck",
    "Seattle", "San Francisco", "Train"
];
Routes
| make-graph OriginLocationID --> DestinationLocationID with Locations on LocationName
| graph-match (src)-[route*1..2]->(dest)
  where any(route, TransportMode == "Train")
  project src.LocationName, 
        dest.LocationName, 
        route_TransportModes = map(route, TransportMode)
```

**Output**

| src_LocationName | dest_LocationName | route_TransportModes|
|---|---|---|
| Seattle | San Francisco | ["Train"] |
| Chicago | Seattle | ["Train"] |
| New York | Chicago | ["Train"] |
| Seattle | Los Angeles | [<br> "Train", <br> "Truck"<br>] |
| Chicago | San Francisco | [<br> "Train", <br> "Train"<br>] |
| New York | Seattle | [<br> "Train", <br> "Train"<br>] |
| Los Angeles | Chicago | [<br> "Truck", <br> "Train"<br>]|


The following example shows how to use the `graph-shortest-paths` operator  with the `any()` and `inner_nodes` functions to find a path between two stations in a transportation network. The query constructs a graph from the `connections` data and finds the shortest path from the `"South-West"` station to the `"North"` station, passing through at least one station where Wi-Fi is available.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA31SPW%2BDMBDd%2BRUnJqhwhkpdUpGl6tqlQ4coihy4FFpjR8ZRFKk%2Fvof5yBnSwmK%2Fe%2B%2B%2BnhU6KIzWWLja6BZyKKWj%2F6AwOVrT7Fu6UWTdOlvrzwycWUCq1jhcUoi2EAHEL6idlSrOIH4z1lXdwWIZZ11wQhjLB%2BfSd3P2RB4eMca7G%2FYH8YGtC9OH%2BET%2Fi7BMEEjvFGD9v8o%2BeFBnHKIjxFgsytAxcR%2FlhRfSaPcMkSInB2dCG%2Bd2XepjvYaDMeqOW86eMfDoKFXbI%2BOqZsi4gUk5vw8Texl1GvHnFv1AI79RfFp5qoA%2FOBBiwx4bde2q23wEDGfK4MWika6ooLgWCttcG40A3ejWpWLLSj48rlZPO7FJSmqz1j5HSm1eKrQIXrAaa%2BZ5MCNIXRKz%2F5g84Pd766gwcaW%2BJjV1YPfakC5h7aS9H10HJ2u%2BCPVbIAODVrJbMuAuk6eFdHtprbwmjTz9U2ZQ0SkWmzgNMjrTvZjlRL%2FcXw9vHgQAAA%3D%3D" target="_blank">Run the query</a>
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
| graph-match cycles=none  (start)-[connections*2..5]->(destination)
  where start.station == "South-West" and
        destination.station == "North" and 
        any(inner_nodes(connections), wifi)
  project from = start.station, 
          stations = strcat_array(map(inner_nodes(connections), station), "->"), 
          to = destination.station
```

**Output**

|from|stations|to|
|---|---|---|
|South-West|South->Central|North|
|South-West|West->Central|North|

## Related content

* [Graph operators](graph-operators.md)
* [graph-match operator](graph-match-operator.md)
* [graph-shortest-paths operator](graph-shortest-paths-operator.md)
* [inner_nodes()](inner-nodes-graph-function.md)
* [map()](map-graph-function.md)
