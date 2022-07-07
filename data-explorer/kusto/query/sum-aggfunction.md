---
title: sum() (aggregation function) - Azure Data Explorer
description: This article describes sum() (aggregation function) in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 07/05/2022
---
# sum() (aggregation function)

Calculates the sum of *Expr* across the group.

* Can be used only in context of aggregation inside [summarize](summarizeoperator.md)

## Syntax

`sum` `(`*Expr*`)`

## Arguments

| Name | Type | Required | Description |
|--|--|--|--|
| *Expr*  string | &check; | Expression used for aggregation calculation. |

## Returns

The sum value of *Expr* across the group.

## Example

This example returns the total number of deaths by state.

**\[**[**Click to run query**](https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuCqUSguzc1NLMqsSlVIBYnFJ+eX5pXYgkkNTR2FkPySxByX1MSSDOfE4tRiBVuQBg2wQLFLZlFqcommQlKlQnBJYkkq2Lj8ohKQAJo+AH3fbol1AAAA)**\]**

```kusto
StormEvents 
| summarize event_count=count(), TotalDeathCases = sum(DeathsDirect) by State 
| sort by TotalDeathCases
```

**Results**

| State                | event_count | TotalDeathCases |
| -------------------- | ----------- | --------------- |
| TEXAS                | 4701        | 71              |
| FLORIDA              | 1042        | 57              |
| CALIFORNIA           | 898         | 48              |
| ILLINOIS             | 2022        | 29              |
| ALABAMA              | 1315        | 29              |
| MISSOURI             | 2016        | 20              |
| NEW YORK             | 1750        | 19              |
| KANSAS               | 3166        | 17              |
| GEORGIA              | 1983        | 17              |
| TENNESSEE            | 1125        | 17              |
| OKLAHOMA             | 1716        | 17              |
| UTAH                 | 360         | 17              |
| WASHINGTON           | 261         | 15              |
| NEVADA               | 163         | 14              |
| NEW JERSEY           | 1044        | 10              |
| MINNESOTA            | 1881        | 10              |
| NORTH CAROLINA       | 1721        | 9               |
| MICHIGAN             | 1637        | 9               |
| SOUTH CAROLINA       | 915         | 9               |
| DELAWARE             | 200         | 8               |
| COLORADO             | 1654        | 7               |
| ARIZONA              | 340         | 7               |
| PENNSYLVANIA         | 1687        | 6               |
| ARKANSAS             | 1028        | 6               |
| KENTUCKY             | 1391        | 5               |
| LOUISIANA            | 463         | 4               |
| INDIANA              | 1164        | 4               |
| OREGON               | 423         | 4               |
| WISCONSIN            | 1850        | 3               |
| MAINE                | 758         | 3               |
| OHIO                 | 1233        | 3               |
| AMERICAN SAMOA       | 16          | 3               |
| VIRGINIA             | 1647        | 2               |
| MARYLAND             | 673         | 2               |
| NEW MEXICO           | 527         | 2               |
| MISSISSIPPI          | 1218        | 2               |
| ATLANTIC SOUTH       | 193         | 2               |
| PUERTO RICO          | 192         | 2               |
| IOWA                 | 2337        | 1               |
| IDAHO                | 247         | 1               |
| WEST VIRGINIA        | 757         | 1               |
| MASSACHUSETTS        | 416         | 1               |
| WYOMING              | 396         | 1               |
| ATLANTIC NORTH       | 188         | 1               |
| LAKE MICHIGAN        | 182         | 1               |
| MONTANA              | 1230        | 1               |
| NORTH DAKOTA         | 905         | 1               |
| E PACIFIC            | 10          | 1               |
| GUAM                 | 4           | 1               |
| SOUTH DAKOTA         | 1567        | 0               |
| HAWAII               | 457         | 0               |
| VERMONT              | 600         | 0               |
| ALASKA               | 257         | 0               |
| CONNECTICUT          | 148         | 0               |
| LAKE HURON           | 63          | 0               |
| RHODE ISLAND         | 51          | 0               |
| LAKE SUPERIOR        | 34          | 0               |
| LAKE ST CLAIR        | 32          | 0               |
| LAKE ERIE            | 27          | 0               |
| DISTRICT OF COLUMBIA | 22          | 0               |
| GULF OF MEXICO       | 577         | 0               |
| VIRGIN ISLANDS       | 12          | 0               |
| NEBRASKA             | 1766        | 0               |
| LAKE ONTARIO         | 8           | 0               |
| GULF OF ALASKA       | 4           | 0               |
| NEW HAMPSHIRE        | 394         | 0               |
| HAWAII WATERS        | 2           | 0               |
