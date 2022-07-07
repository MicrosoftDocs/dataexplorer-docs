---
title: avg() (aggregation function) - Azure Data Explorer
description: This article describes avg() (aggregation function) in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 07/05/2022
---
# avg() (aggregation function)

Calculates the average (arithmetic mean) of *Expr* across the group.

* Can only be used in context of aggregation inside [summarize](summarizeoperator.md)

## Syntax

`avg` `(`*Expr*`)`

## Arguments

| Name | Type | Required | Description |
|--|--|--|--|
| *Expr* | string | &check; | Expression used for aggregation calculation. Records with `null` values are ignored and not included in the calculation. |

## Returns

The average value of *Expr* across the group.

## Examples

This example returns the average number of damaged crops per state.

**\[**[**Click to run query**](https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKC7NzU0syqxKVXAsS3dJzE1MTw3Jdy7KLyhWsFVILEvXgIiBRTQVkioVgksSS1IBk8Ju20QAAAA=)**\]**

```kusto
StormEvents
| summarize AvgDamageToCrops = avg(DamageCrops) by State
```

**Results**

| State                | AvgDamageToCrops |
| -------------------- | ---------------- |
| TEXAS                | 7524.569241      |
| KANSAS               | 15366.86671      |
| IOWA                 | 4332.477535      |
| ILLINOIS             | 44568.00198      |
| MISSOURI             | 340719.2212      |
| GEORGIA              | 490702.5214      |
| MINNESOTA            | 2835.991494      |
| WISCONSIN            | 17764.37838      |
| NEBRASKA             | 21366.36467      |
| NEW YORK             | 5.714285714      |
| NORTH CAROLINA       | 86661.24346      |
| OKLAHOMA             | 633.4498834      |
| PENNSYLVANIA         | 2.963841138      |
| COLORADO             | 193.4703748      |
| VIRGINIA             | 97027.92957      |
| MICHIGAN             | 1259.010385      |
| SOUTH DAKOTA         | 3.190810466      |
| KENTUCKY             | 62456.50611      |
| ALABAMA              | 768.8212928      |
| OHIO                 | 27107.05596      |
| MONTANA              | 21138.21138      |
| MISSISSIPPI          | 640073.8916      |
| INDIANA              | 22733.67698      |
| TENNESSEE            | 13633.06667      |
| NEW JERSEY           | 96.74329502      |
| FLORIDA              | 48826.29559      |
| ARKANSAS             | 389.1050584      |
| SOUTH CAROLINA       | 42690.71038      |
| NORTH DAKOTA         | 257649.7238      |
| CALIFORNIA           | 1510041.203      |
| MAINE                | 0                |
| WEST VIRGINIA        | 79.65653897      |
| MARYLAND             | 0                |
| VERMONT              | 75               |
| GULF OF MEXICO       | 0                |
| NEW MEXICO           | 611.0056926      |
| LOUISIANA            | 1835.853132      |
| HAWAII               | 2188.183807      |
| OREGON               | 63.82978723      |
| MASSACHUSETTS        | 4.807692308      |
| WYOMING              | 15.15151515      |
| NEW HAMPSHIRE        | 0                |
| UTAH                 | 0                |
| ARIZONA              | 0                |
| WASHINGTON           | 68.96551724      |
| ALASKA               | 0                |
| IDAHO                | 161.9433198      |
| DELAWARE             | 0                |
| ATLANTIC SOUTH       | 0                |
| PUERTO RICO          | 5.729166667      |
| ATLANTIC NORTH       | 0                |
| LAKE MICHIGAN        | 0                |
| NEVADA               | 30.67484663      |
| CONNECTICUT          | 0                |
| LAKE HURON           | 0                |
| RHODE ISLAND         | 0                |
| LAKE SUPERIOR        | 0                |
| LAKE ST CLAIR        | 0                |
| LAKE ERIE            | 0                |
| DISTRICT OF COLUMBIA | 0                |
| AMERICAN SAMOA       | 16875            |
| VIRGIN ISLANDS       | 416.6666667      |
| E PACIFIC            | 0                |
| LAKE ONTARIO         | 0                |
| GULF OF ALASKA       | 0                |
| GUAM                 | 0                |
| HAWAII WATERS        | 0                |
