---
title: minif() (aggregation function) - Azure Data Explorer
description: This article describes minif() (aggregation function) in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/13/2020
---
# minif() (aggregation function)

Returns the minimum value across the group for which *Predicate* evaluates to `true`.

* Can be used only in context of aggregation inside [summarize](summarizeoperator.md)

See also - [min()](min-aggfunction.md) function, which returns the minimum value across the group without predicate expression.

## Syntax

 `minif` `(`*Expr*`,`*Predicate*`)`

## Arguments

| Name | Type | Required | Description |
|--|--|--|--|
| *Expr* | string | &check; | Expression that will be used for aggregation calculation. |
| *Predicate* | string | &check; | Expression that will be used to filter rows. |

## Returns

The minimum value of *Expr* across the group for which *Predicate* evaluates to `true`.

## Example

Shows the minimum damage for events with casualties (Except 0)

**\[**[**Click to run query**](https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA3WOsQ6CUAxFd7+iIwQGfwAXcHAwMWFwrlKlCa+Y16Ji/Hif1NXp3tvenrS1MYbtncR09QZ6GkkHDQa8UuVSx/GmhftD8hRtLqEhtF4rl4Yjna3wsJNuiQmnUwgY+UWwZ3HCka2vUSccjEmrwMKXzFdl5gDYrHPA9MZv/s05nGZoDY0gcR89xb/MVF+uWWU0mYYh+1PMPyFcEcH8AAAA)**\]**

```kusto
StormEvents
| extend Damage=DamageCrops+DamageProperty, Deaths=DeathsDirect+DeathsIndirect
| summarize MinDamageWithCasualties=minif(Damage,(Deaths >0) and (Damage >0)) by State 
| where MinDamageWithCasualties >0 and isnotnull(MinDamageWithCasualties)
```

**Results**

| State          | MinDamageWithCasualties |
| -------------- | ----------------------- |
| TEXAS          | 8000                    |
| KANSAS         | 5000                    |
| IOWA           | 45000                   |
| ILLINOIS       | 100000                  |
| MISSOURI       | 10000                   |
| GEORGIA        | 500000                  |
| MINNESOTA      | 200000                  |
| WISCONSIN      | 10000                   |
| NEW YORK       | 25000                   |
| NORTH CAROLINA | 15000                   |
| OKLAHOMA       | 5000                    |
| PENNSYLVANIA   | 400000                  |
| COLORADO       | 1000                    |
| VIRGINIA       | 15000                   |
| MICHIGAN       | 25000                   |
| KENTUCKY       | 1000                    |
| ALABAMA        | 2000000                 |
| OHIO           | 1300000                 |
| INDIANA        | 10000                   |
| NEW JERSEY     | 4000000                 |
| FLORIDA        | 130000                  |
| ARKANSAS       | 150000                  |
| SOUTH CAROLINA | 500000                  |
| NORTH DAKOTA   | 15000                   |
| CALIFORNIA     | 80000                   |
| MAINE          | 25000000                |
| WEST VIRGINIA  | 30000                   |
| MARYLAND       | 5000                    |
| NEW MEXICO     | 16500000                |
| LOUISIANA      | 10000                   |
| NEW HAMPSHIRE  | 30000                   |
| UTAH           | 200000                  |
| ARIZONA        | 5000                    |
| WASHINGTON     | 12000                   |
| PUERTO RICO    | 100000                  |
