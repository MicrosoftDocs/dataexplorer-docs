---
title: .show graph_snapshots statistics command
description: Learn how to display statistics for all graph snapshots using the .show graph_snapshots statistics command with syntax, parameters, and examples.
ms.reviewer: vilauzon
ms.topic: reference
ms.date: 02/02/2026
---

# .show graph_snapshots statistics (preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

> [!NOTE]
> This feature is currently in public preview. Functionality and syntax are subject to change before General Availability.

Displays detailed statistics for all snapshots of a specific graph model, including performance metrics, resource utilization, and processing details.

## Permissions

You must have at least [Database User, Database Viewer, or Database Monitor](../../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.show` `graph_snapshots` *GraphModelName* `statistics`

`.show` `graph_snapshots` `*` `statistics`

[Learn more about syntax conventions](../../query/syntax-conventions.md).

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*GraphModelName*|`string`|✅|The name of the graph model to display snapshots statistics for. If not specified, use `*` to show statistics for all graph models.|

## Returns

This command returns a table with the following columns:

|Column|Type|Description|
|--|--|--|
|*DatabaseName*|`string`|The name of the database containing the graph model.|
|*ModelName*|`string`|The name of the graph model.|
|*ModelId*|`guid`|The unique identifier of the graph model.|
|*Name*|`string`|The name of the snapshot.|
|*SnapshotTime*|`datetime`|The time when the snapshot was created.|
|*TotalCpu*|`timespan`|The total CPU time consumed during snapshot creation.|
|*MemoryPeak*|`long`|The peak memory usage (in bytes) during snapshot creation.|
|*Duration*|`timespan`|The total duration of the snapshot creation process.|
|*NodesCount*|`long`|The number of nodes in the snapshot.|
|*EdgesCount*|`long`|The number of edges in the snapshot.|
|*NodesSize*|`long`|The size of nodes data (in bytes).|
|*EdgesSize*|`long`|The size of edges data (in bytes).|
|*Details*|`string`|JSON object containing detailed step-by-step statistics and seal information.|

## Examples

### Show statistics for all snapshots of a graph model

```kusto
.show graph_snapshots MyGraphModel statistics
```

#### Output

|DatabaseName|ModelName|ModelId|Name|SnapshotTime|TotalCpu|MemoryPeak|Duration|NodesCount|EdgesCount|NodesSize|EdgesSize|Details|
|--|--|--|--|--|--|--|--|--|--|--|--|--|
|MyDatabase|MyGraphModel|a1b2c3d4-e5f6-7890-abcd-ef1234567890|snapshot1|2025-09-10T10:30:00.000Z|00:00:15.250|104857600|00:00:25.500|1000000|2500000|536870912|1073741824|{"Steps":[...],"Seal":{...}}|
|MyDatabase|MyGraphModel|a1b2c3d4-e5f6-7890-abcd-ef1234567890|snapshot2|2025-09-10T14:45:00.000Z|00:00:18.750|125829120|00:00:30.250|1200000|2800000|644245094|1288490189|{"Steps":[...],"Seal":{...}}|
|MyDatabase|MyGraphModel|a1b2c3d4-e5f6-7890-abcd-ef1234567890|snapshot3|2025-09-10T18:20:00.000Z|00:00:12.500|83886080|00:00:22.000|800000|2000000|429496730|858993459|{"Steps":[...],"Seal":{...}}|

### Show statistics for all snapshots across all graph models

```kusto
.show graph_snapshots * statistics
```

This command returns statistics for all snapshots of all graph models in the database, which is useful for system-wide analysis and monitoring.

### Understanding the output

The command returns one row for each completed snapshot of the specified graph model. Each row contains comprehensive statistics and performance metrics for that snapshot.

#### Resource utilization metrics

- **TotalCpu**: Cumulative CPU time across all processing steps
- **MemoryPeak**: Highest memory consumption during any step of the process
- **Duration**: Wall clock time from start to completion of snapshot creation

#### Data size metrics

- **NodesCount/EdgesCount**: Number of graph elements in the snapshot
- **NodesSize/EdgesSize**: Storage size of the graph data structures

#### Details column structure

The `Details` column contains a JSON object with step-by-step processing information for each snapshot:

```json
{
  "Steps": [
    {
      "Kind": "AddNodes",
      "StepNumber": 0,
      "Status": "Completed",
      "Duration": "00:00:00.9260505",
      "StartTime": "2025-09-04T12:15:33.1567939Z",
      "AddedElementsCount": 2,
      "AddedElementsSizeDelta": 1838,
      "TotalCpu": "00:00:01.0937500",
      "MemoryPeak": 1193360
    },
    {
      "Kind": "AddEdges",
      "StepNumber": 1,
      "Status": "Completed",
      "Duration": "00:00:00.4027208",
      "StartTime": "2025-09-04T12:15:34.0846894Z",
      "AddedElementsCount": 2,
      "AddedElementsSizeDelta": 2688,
      "TotalCpu": "00:00:00.3906250",
      "MemoryPeak": 3789792
    }
  ],
  "Seal": {
    "Status": "Completed",
    "StartTime": "2025-09-10T10:30:13.000Z",
    "Duration": "00:00:12.500",
    "TotalCpu": "00:00:06.250",
    "MemoryPeak": 104857600
  }
}
```

## Notes

- Only completed snapshots are included in the results
- Statistics are aggregated across all processing steps for each snapshot
- If no snapshots exist for the specified graph model, the command returns an empty result set
- The command fails if the specified graph model doesn't exist
- The `Details` column provides a step-by-step breakdown of the snapshot creation process for each snapshot

## Related commands

- [.show graph_snapshot statistics](graph-snapshot-statistics-show.md)
- [.show graph_snapshots failures](graph-snapshots-failures-show.md)
- [.show graph_model](graph-model-show.md)
- [.show graph_snapshots](graph-snapshots-show.md)
