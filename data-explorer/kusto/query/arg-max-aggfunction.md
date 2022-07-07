---
title: arg_max() (aggregation function) - Azure Data Explorer
description: This article describes arg_max() (aggregation function) in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 07/05/2022
---
# arg_max() (aggregation function)

Finds a row in the group that maximizes *ExprToMaximize*, and returns the value of *ExprToReturn* (or `*` to return the entire row).

* Can be used only in context of aggregation inside [summarize](summarizeoperator.md)

## Syntax

`arg_max` `(`*ExprToMaximize*`,` *\** | *ExprToReturn*  [`,` ...]`)`

## Arguments

| Name | Type | Required | Description |
|--|--|--|--|
| *ExprToMaximize* | string | &check; | Expression used for aggregation calculation. |
| *ExprToReturn* | string | &check; | Expression used for returning the value when *ExprToMaximize* is maximum.  Use a wildcard (*) to return all columns of the input table. |

## Returns

Finds a row in the group that maximizes *ExprToMaximize*, and
returns the value of *ExprToReturn* (or `*` to return the entire row).

## Examples

The following examples demonstrate how to use this function.

**Example 1**

Find the northern most location of a storm event in each state.
**\[**[**Click to run query**](https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuCqUSguzc1NLMqsSlVILEqPz02s0HBKTc/M80ks0VGAsPKTE0sy8/M0FZIqFYJLEktSATqyPZtCAAAA)**\]**

```kusto
StormEvents 
| summarize arg_max(BeginLat, BeginLocation) by State
```

**Results**

| State                | BeginLat | BeginLocation        |
| -------------------- | -------- | -------------------- |
| MISSISSIPPI          | 34.97    | BARTON               |
| VERMONT              | 45       | NORTH TROY           |
| AMERICAN SAMOA       | -14.2    | OFU                  |
| HAWAII               | 22.2113  | PRINCEVILLE          |
| MINNESOTA            | 49.35    | ARNESEN              |
| RHODE ISLAND         | 42       | WOONSOCKET           |
| INDIANA              | 41.73    | FREMONT              |
| WEST VIRGINIA        | 40.62    | CHESTER              |
| SOUTH CAROLINA       | 35.18    | LANDRUM              |
| TEXAS                | 36.4607  | DARROUZETT           |
| GEORGIA              | 34.97    | ROSSVILLE            |
| NEW YORK             | 45       | PERRYS MILLS         |
| OKLAHOMA             | 37.0034  | TYRONE               |
| FLORIDA              | 31.0216  | JAY                  |
| OHIO                 | 41.95    | CONNEAUT             |
| COLORADO             | 40.99    | JULESBURG            |
| ALABAMA              | 37.8057  | MAPLE HILL           |
| LOUISIANA            | 33.0067  | BEEKMAN              |
| VIRGIN ISLANDS       | 18.35    | ST. THOMAS           |
| PENNSYLVANIA         | 42.22    | NORTH EAST           |
| KENTUCKY             | 39.08    | NEWPORT              |
| DELAWARE             | 39.78    | HOCKESSIN            |
| PUERTO RICO          | 18.47    | AGUADILLA            |
| MICHIGAN             | 47.4189  | COPPER HARBOR        |
| KANSAS               | 40       | WOODRUFF             |
| MAINE                | 47.35    | MADAWASKA            |
| NORTH CAROLINA       | 36.55    | ENNICE               |
| MARYLAND             | 39.72    | HAGERSTOWN ARPT      |
| WISCONSIN            | 46.81    | BAYFIELD             |
| VIRGINIA             | 39.28    | GAINESBORO           |
| MONTANA              | 49.009   | TURNER               |
| WASHINGTON           | 48.5111  | SEDRO WOOLLEY        |
| IOWA                 | 43.5     | CHESTER              |
| ALASKA               | 64.5131  | HEALY LAKE           |
| MASSACHUSETTS        | 42.86    | AMESBURY             |
| NEW JERSEY           | 41.28    | COLESVILLE           |
| IDAHO                | 48.72    | MOYIE SPGS           |
| NORTH DAKOTA         | 48.9935  | DUNSEITH             |
| ARKANSAS             | 36.4813  | LEAD HILL            |
| NEVADA               | 41.7134  | CHARLESTON           |
| NEW MEXICO           | 37.0336  | RATON                |
| CALIFORNIA           | 41.83    | MACDOEL              |
| SOUTH DAKOTA         | 45.95    | LEMMON               |
| ILLINOIS             | 42.49    | WARREN               |
| ARIZONA              | 36.9001  | PAGE                 |
| WYOMING              | 44.98    | MAMMOTH HOT SPRINGS  |
| CONNECTICUT          | 42.03    | CANAAN               |
| OREGON               | 45.82    | WESTON               |
| MISSOURI             | 40.58    | COATSVILLE           |
| NEBRASKA             | 42.9789  | SPARKS               |
| NEW HAMPSHIRE        | 44.88    | COLEBROOK            |
| TENNESSEE            | 36.65    | MODEL                |
| UTAH                 | 41.93    | GARDEN CITY          |
| DISTRICT OF COLUMBIA | 38.92    | GEORGETOWN           |
| GUAM                 |          |                      |
| HAWAII WATERS        | 21.2     | KALAUPAPA            |
| LAKE HURON           | 45.9466  | CEDARVILLE           |
| LAKE ONTARIO         | 43.87    | HENDERSON HARBOR     |
| E PACIFIC            | 47.2409  | PORT ORCHARD         |
| ATLANTIC SOUTH       | 34.2778  | MASONBORO INLET      |
| LAKE ST CLAIR        | 42.98    | PORT HURON           |
| LAKE SUPERIOR        | 48.22    | PASSAGE ISLAND LIGHT |
| GULF OF MEXICO       | 31.02    | PERDIDO KEY          |
| LAKE MICHIGAN        | 46.0855  | NAUBINWAY            |
| ATLANTIC NORTH       | 43.8955  | ROCKLAND             |
| GULF OF ALASKA       | 58.8024  | HAINES               |
| LAKE ERIE            | 42.8995  | BUFFALO HARBOR       |

**Example 2**

Find the first time an event with a direct death happened in each state.

**\[**[**Click to run query**](https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKM9ILUpVcElNLMkodsksSk0uUbBTMABKFJfm5iYWZValKiQWpcfnJlZoBJckFpWEZOam6ihoaSokVSoABUpSAQPollZPAAAA)**\]**

```kusto
StormEvents
| where DeathsDirect > 0
| summarize arg_max(StartTime, *) by State
```

**Example 3**

The following example demonstrates null handling.

**\[**[**Click to run query**](https://dataexplorer.azure.com/clusters/kvc6bc487453a064d3c9de.northeurope/databases/new-free-database?query=H4sIAAAAAAAAA31PwQrCMAy97ytCT530osfdnKBX8SCIiHQsjEKWjrRjKH68nWwoguYdkry8l5DaxoSKUG+ld7GAEMVxY2Djycu7PaIE57kAxzGHcwYp1LrrCJUBdcA6paX5oneCyKlIHs09UT4JSssJo+KERH74K/m1ZI9WxnkpfuCP6zM/+1Ymu2QPCH3bWnF3BCvNtXWsp5cMLHKobvD6/wlU5dHuDwEAAA==)**\]**

```kusto
datatable(Fruit: string, Color: string, Version: int) [
    "Apple", "Red", 1,
    "Apple", "Green", int(null),
    "Banana", "Yellow", int(null),
    "Banana", "Green", int(null),
    "Pear", "Brown", 1,
    "Pear", "Green", 2,
]
| summarize arg_max(Version, *) by Fruit
```

| Fruit | Version | Color |
|--|--|--|
| Apple | 1 | Red |
| Banana |  | Yellow |
| Pear | 2 | Green |
