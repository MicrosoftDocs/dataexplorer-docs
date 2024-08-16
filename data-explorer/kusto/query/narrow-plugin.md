---
title:  narrow plugin
description: Learn how to use the narrow plugin to display a wide table.
ms.reviewer: alexans
ms.topic: reference
ms.date: 12/26/2022
---
# narrow plugin

The `narrow` plugin "unpivots" a wide table into a table with three columns:

* Row number
* Column type
* Column value (as `string`)

The `narrow` plugin is designed mainly for display purposes, as it allows wide
tables to be displayed comfortably without the need of horizontal scrolling.

The plugin is invoked with the [`evaluate`](evaluate-operator.md) operator.

## Syntax

`T | evaluate narrow()`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Examples

The following example shows an easy way to read the output of the Kusto
`.show diagnostics` management command.

```kusto
.show diagnostics
 | evaluate narrow()
```

The results of `.show diagnostics` itself is a table with a single row and
33 columns. By using the `narrow` plugin we "rotate" the output to something
like this:

Row  | Column                              | Value
-----|-------------------------------------|-----------------------------
0    | IsHealthy                           | True
0    | IsRebalanceRequired                 | False
0    | IsScaleOutRequired                  | False
0    | MachinesTotal                       | 2
0    | MachinesOffline                     | 0
0    | NodeLastRestartedOn                 | 2017-03-14 10:59:18.9263023
0    | AdminLastElectedOn                  | 2017-03-14 10:58:41.6741934
0    | ClusterWarmDataCapacityFactor       | 0.130552847673333
0    | ExtentsTotal                        | 136
0    | DiskColdAllocationPercentage        | 5
0    | InstancesTargetBasedOnDataCapacity  | 2
0    | TotalOriginalDataSize               | 5167628070
0    | TotalExtentSize                     | 1779165230
0    | IngestionsLoadFactor                | 0
0    | IngestionsInProgress                | 0
0    | IngestionsSuccessRate               | 100
0    | MergesInProgress                    | 0
0    | BuildVersion                        | 1.0.6281.19882
0    | BuildTime                           | 2017-03-13 11:02:44.0000000
0    | ClusterDataCapacityFactor           | 0.130552847673333
0    | IsDataWarmingRequired               | False
0    | RebalanceLastRunOn                  | 2017-03-21 09:14:53.8523455
0    | DataWarmingLastRunOn                | 2017-03-21 09:19:54.1438800
0    | MergesSuccessRate                   | 100
0    | NotHealthyReason                    | [null]
0    | IsAttentionRequired                 | False
0    | AttentionRequiredReason             | [null]
0    | ProductVersion                      | KustoRelease_2017.03.13.2
0    | FailedIngestOperations              | 0
0    | FailedMergeOperations               | 0
0    | MaxExtentsInSingleTable             | 64
0    | TableWithMaxExtents                 | KustoMonitoringPersistentDatabase.KustoMonitoringTable
0    | WarmExtentSize                      | 1779165230
