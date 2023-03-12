---
title: make_set() (aggregation function) - Azure Data Explorer
description: Learn how to use the make_set() function to return a JSON array of the distinct values that the expression takes in the group. 
ms.reviewer: alexans
ms.topic: reference
ms.date: 03/12/2023
---
# make_set() (aggregation function)

Creates a `dynamic` array of the set of distinct values that *expr* takes in the group.

[!INCLUDE [data-explorer-agg-function-summarize-note](../../includes/data-explorer-agg-function-summarize-note.md)]

> **Deprecated aliases:** makeset()

## Syntax

 `make_set(`*expr* [`,` *maxSize*]`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *expr* | string | &check; | The expression used for the aggregation calculation. |
| *maxSize* | int |  | The maximum number of elements returned. The default and max value is 1048576. |

> [!NOTE]
> The deprecated version has a default *maxSize* limit of 128.

## Returns

Returns a `dynamic` array of the set of distinct values that *expr* takes in the group.
The array's sort order is undefined.

> [!TIP]
> To only count distinct values, use [dcount()](dcount-aggfunction.md) or [count_distinct()](count-distinct-aggfunction.md).

## Example

This example shows the set of states grouped with the same amount of crop damage.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuDlqlEoLs3NTSzKrEpVKC5JLEktts1NzE6NL04t0QgG8TUVkioVXBJzE9NTnYvyC4oBmxrbeD8AAAA=" target="_blank">Run the query</a>

```kusto
StormEvents 
| summarize states=make_set(State) by DamageCrops
```

The results table shown includes only the first 10 rows.

| DamageCrops | states |
|--|--|
| 0 | ["NORTH CAROLINA","WISCONSIN","NEW YORK","ALASKA","DELAWARE","OKLAHOMA","INDIANA","ILLINOIS","MINNESOTA","SOUTH DAKOTA","TEXAS","UTAH","COLORADO","VERMONT","NEW JERSEY","VIRGINIA","CALIFORNIA","PENNSYLVANIA","MONTANA","WASHINGTON","OREGON","HAWAII","IDAHO","PUERTO RICO","MICHIGAN","FLORIDA","WYOMING","GULF OF MEXICO","NEVADA","LOUISIANA","TENNESSEE","KENTUCKY","MISSISSIPPI","ALABAMA","GEORGIA","SOUTH CAROLINA","OHIO","NEW MEXICO","ATLANTIC SOUTH","NEW HAMPSHIRE","ATLANTIC NORTH","NORTH DAKOTA","IOWA","NEBRASKA","WEST VIRGINIA","MARYLAND","KANSAS","MISSOURI","ARKANSAS","ARIZONA","MASSACHUSETTS","MAINE","CONNECTICUT","GUAM","HAWAII WATERS","AMERICAN SAMOA","LAKE HURON","DISTRICT OF COLUMBIA","RHODE ISLAND","LAKE MICHIGAN","LAKE SUPERIOR","LAKE ST CLAIR","LAKE ERIE","LAKE ONTARIO","E PACIFIC","GULF OF ALASKA"] |
| 30000 | ["TEXAS","NEBRASKA","IOWA","MINNESOTA","WISCONSIN"] |
| 4000000 | ["CALIFORNIA","KENTUCKY","NORTH DAKOTA","WISCONSIN","VIRGINIA"] |
| 3000000 | ["CALIFORNIA","ILLINOIS","MISSOURI","SOUTH CAROLINA","NORTH CAROLINA","MISSISSIPPI","NORTH DAKOTA","OHIO"] |
| 14000000 | ["CALIFORNIA","NORTH DAKOTA"] |
| 400000 | ["CALIFORNIA","MISSOURI","MISSISSIPPI","NEBRASKA","WISCONSIN","NORTH DAKOTA"] |
| 50000 | ["CALIFORNIA","GEORGIA","NEBRASKA","TEXAS","WEST VIRGINIA","KANSAS","MISSOURI","MISSISSIPPI","NEW MEXICO","IOWA","NORTH DAKOTA","OHIO","WISCONSIN","ILLINOIS","MINNESOTA","KENTUCKY"] |
| 18000 | ["WASHINGTON","WISCONSIN"] |
| 107900000 | ["CALIFORNIA"] |
| 28900000 | ["CALIFORNIA"] |

## See also

* Use [`mv-expand`](./mvexpandoperator.md) operator for the opposite function.
* [`make_set_if`](./makesetif-aggfunction.md) operator is similar to `make_set`, except it also accepts a predicate.
