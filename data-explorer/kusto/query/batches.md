---
title:  Batches
description:  This article describes Batches.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/13/2025
---
# Batches

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

A query can include multiple tabular expression statements, as long as they're delimited by a semicolon (`;`) character. The query then returns multiple tabular results. Results are produced by the tabular expression statements and ordered according to the order of the statements in the query text.

> [!NOTE]
>
> * Prefer batching and [`materialize`](materialize-function.md) over using the [fork operator](fork-operator.md).
> * Any two statements must be separated by a semicolon.

## Examples

[!INCLUDE [help-cluster](../includes/help-cluster-samples-stormevents.md)]

### Name tabular results

The following query produces two tabular results. User agent tools can then display those results with the appropriate name associated with each (`Count of events in Florida` and `Count of events in Guam`, respectively).

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVqhRKM9ILUpVCC5JLElVsLVVUHLz8Q/ydHFUAkol55fmlQDpxGKFaHVnMCc/TSEVojMzT8EtJ78oMyVRPdaalysYr6HuoY6+xJjoXpqYqx4LAI0euu6hAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents | where State == "FLORIDA" | count | as ['Count of events in Florida'];
StormEvents | where State == "GUAM" | count | as ['Count of events in Guam']
```

**Output**

### [Count_of_events_in_Florida](#tab/florida)

| Count |
| -- |
| 1042 |

### [Count_of_events_in_Guam](#tab/guam)

| Count |
| -- |
| 4 |

### Share a calculation

Batching is useful for scenarios where a common calculation is shared by multiple subqueries, such as for dashboards. If the common calculation is complex, use the [materialize() function](materialize-function.md) and construct the query so that it will be executed only once.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVHIVbBVyE0sSS3KTMzJrErVCC7JL8p1LUvNKylWqFEoLs3NTSwCiivk2Sbnl+aVaGgqJFUqBJcAdWha83LlAtWUZ6QWAeUV7BSMDAwM0ARtFAwNAArTIWBnAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
let m = materialize(StormEvents | summarize n=count() by State);
m | where n > 2000;
m | where n < 10
```

**Output**

### [Table1](#tab/Table 1)

| State | n    |
|-------|------|
| ILLINOIS | 2022|
| IOWA | 2337    
| KANSAS | 3166 |
| MISSOURI | 2016  
| TEXAS | 4701 |

### [Table2](#tab/Table 2)

| State | n    |
|-------|------|
| GUAM | 2022|
| GULF OF ALASKA | 2337    
| HAWAII WATERS | 3166 |
| LAKE ONTARIO | 2016  
