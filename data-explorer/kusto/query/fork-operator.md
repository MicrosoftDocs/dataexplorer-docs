---
title:  fork operator
description: Learn how to use the fork operator to run multiple consumer operators in parallel.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/21/2025
monikerRange: "microsoft-fabric || azure-data-explorer"
---
# fork operator

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Runs multiple consumer operators in parallel.

## Syntax

*T* `|` `fork` [*name*`=`]`(`*subquery*`)` [*name*`=`]`(`*subquery*`)` ...

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *subquery* | `string` |  :heavy_check_mark: | A downstream pipeline of [supported query operators](#supported-query-operators).|
| *name* | `string` | | A temporary name for the subquery result table.|

> [!NOTE]
>
> * Avoid using `fork` with a single *subquery*.
> * The name of the results tab is the same name as provided with the `name` parameter or the [`as` operator](as-operator.md).

### Supported query operators

* [`as`](as-operator.md)
* [`count`](count-operator.md)
* [`extend`](extend-operator.md)
* [`parse`](parse-operator.md)
* [`where`](where-operator.md)
* [`take`](take-operator.md)
* [`project`](project-operator.md)
* [`project-away`](project-away-operator.md)
* [`project-keep`](project-keep-operator.md)
* [`project-rename`](project-rename-operator.md)
* [`project-reorder`](project-reorder-operator.md)
* [`summarize`](summarize-operator.md)
* [`top`](top-operator.md)
* [`top-nested`](top-nested-operator.md)
* [`sort`](sort-operator.md)
* [`mv-expand`](mv-expand-operator.md)
* [`reduce`](reduce-operator.md)

## Returns

Multiple result tables, one for each of the *subquery* arguments.

## Tips

* Use [`materialize`](materialize-function.md) as a replacement for [`join`](join-operator.md) or [`union`](union-operator.md) on fork legs. The input stream is cached by materialize and then the cached expression can be used in join/union legs.

* Use [batch](batches.md) with [`materialize`](materialize-function.md) of tabular expression statements instead of the `fork` operator.

## Examples

[!INCLUDE [help-cluster-note](../includes/help-cluster-note.md)]


The following example returns two tables with unnamed columns. 
:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5uWqUSjPSC1KVQguSSxJVbC1VVBy8/EP8nRxVALJpeUXZfNyKQCBBlSdS2piSUaxS2ZRanKJgjaU65mXAhGwUzDURFXvmZdVWpSZitABE0DRAwCWU8oSkwAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| where State == "FLORIDA"
| fork
    ( where DeathsDirect + DeathsIndirect > 1)
    ( where InjuriesDirect + InjuriesIndirect > 1)
```

**Output**

This output shows the first few rows and columns of the result table.

### [GenericResult](#tab/generic-result-1)

| StartTime | EndTime | EpisodeId | EventId | State | EventType | InjuriesDirect | InjuriesIndirect |
|--|--|--|--|--|--|--|--|
| 2007-02-02T03:17:00Z | 2007-02-02T03:25:00Z | 3464 | 18948 | FLORIDA | Tornado | 10 | 0 |
| 2007-02-02T03:37:00Z | 2007-02-02T03:55:00Z | 3464 | 18950 | FLORIDA | Tornado | 9 | 0 |
| 2007-03-13T08:20:00Z | 2007-03-13T08:20:00Z | 4094 | 22961 | FLORIDA | Dense Fog | 3 | 0 |
| 2007-09-11T15:26:00Z | 2007-09-11T15:26:00Z | 9578 | 53798 | FLORIDA | Rip Current | 0 | 0 |

### [GenericResult](#tab/generic-result-2)

| StartTime | EndTime | EpisodeId | EventId | State | EventType | InjuriesDirect | InjuriesIndirect |
|--|--|--|--|--|--|--|--|
| 2007-02-02T03:10:00Z | 2007-02-02T03:16:00Z | 2545 | 17515 | FLORIDA | Tornado | 15 | 0 |
| 2007-02-02T03:17:00Z | 2007-02-02T03:25:00Z | 3464 | 18948 | FLORIDA | Tornado | 10 | 0 |
| 2007-02-02T03:37:00Z | 2007-02-02T03:55:00Z | 3464 | 18950 | FLORIDA | Tornado | 9 | 0 |
| 2007-02-02T03:55:00Z | 2007-02-02T04:10:00Z | 3464 | 20318 | FLORIDA | Tornado | 42 | 0 |

---

### Named subqueries

In the following examples, the result table is named "StormsWithDeaths" and "StormsWithInjuries".

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5uWqUSjPSC1KVQguSSxJVbC1VVBy8/EP8nRxVALJpeUXZfNyKQCBBkSZS2piSUaxS2ZRanKJgjaU65mXAhGwUzBUqFFILAaaBrSiODyzJAOiQhPFEM+8rNKizFSEMTABfAbB1GgCAM0zVJu/AAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| where State == "FLORIDA"
| fork
    (where DeathsDirect + DeathsIndirect > 1 | as StormsWithDeaths)
    (where InjuriesDirect + InjuriesIndirect > 1 | as StormsWithInjuries)
```

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5uWqUSjPSC1KVQguSSxJVbC1VVBy8/EP8nRxVALJpeUXZfNyKQBBMEhTcXhmSYZLamJJRrGCrYIGRCeE75JZlJpcoqAN5XrmpUAE7BQMNdFN8MzLKi3KTEUyAyYCNwUmgGIOAGODP2W5AAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| where State == "FLORIDA"
| fork
    StormsWithDeaths = (where DeathsDirect + DeathsIndirect > 1)
    StormsWithInjuries = (where InjuriesDirect + InjuriesIndirect > 1)
```

**Output**

This output shows the first few rows and columns of the result table.

#### [StormsWithDeaths](#tab/deaths)

| StartTime | EndTime | EpisodeId | EventId | State | EventType | InjuriesDirect | InjuriesIndirect |
|--|--|--|--|--|--|--|--|
| 2007-02-02T03:17:00Z | 2007-02-02T03:25:00Z | 3464 | 18948 | FLORIDA | Tornado | 10 | 0 |
| 2007-02-02T03:37:00Z | 2007-02-02T03:55:00Z | 3464 | 18950 | FLORIDA | Tornado | 9 | 0 |
| 2007-03-13T08:20:00Z | 2007-03-13T08:20:00Z | 4094 | 22961 | FLORIDA | Dense Fog | 3 | 0 |
| 2007-09-11T15:26:00Z | 2007-09-11T15:26:00Z | 9578 | 53798 | FLORIDA | Rip Current | 0 | 0 |

#### [StormsWithInjuries](#tab/injuries)

| StartTime | EndTime | EpisodeId | EventId | State | EventType | InjuriesDirect | InjuriesIndirect |
|--|--|--|--|--|--|--|--|
| 2007-02-02T03:10:00Z | 2007-02-02T03:16:00Z | 2545 | 17515 | FLORIDA | Tornado | 15 | 0 |
| 2007-02-02T03:17:00Z | 2007-02-02T03:25:00Z | 3464 | 18948 | FLORIDA | Tornado | 10 | 0 |
| 2007-02-02T03:37:00Z | 2007-02-02T03:55:00Z | 3464 | 18950 | FLORIDA | Tornado | 9 | 0 |
| 2007-02-02T03:55:00Z | 2007-02-02T04:10:00Z | 3464 | 20318 | FLORIDA | Tornado | 42 | 0 |

---
