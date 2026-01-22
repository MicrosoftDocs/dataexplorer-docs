---
title: .show graph_snapshot statistics command
description: Learn how to display graph snapshot statistics using the .show graph_snapshot statistics command with syntax, parameters, and examples.
ms.reviewer: vilauzon
ms.topic: reference
ms.date: 09/10/2025
---

# .show graph_snapshot statistics (preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

> [!NOTE]
> This feature is currently in public preview. Functionality and syntax are subject to change before General Availability.

Displays detailed statistics for a specific graph snapshot, including performance metrics, resource utilization, and processing details.

## Permissions

You must have at least [Database User, Database Viewer, or Database Monitor](../../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.show` `graph_snapshot` *GraphModelName*`.`*SnapshotName* `statistics`

[Learn more about syntax conventions](../../query/syntax-conventions.md).

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*GraphModelName*|`string`|✅|The name of the graph model.|
|*SnapshotName*|`string`|✅|The name of the snapshot to display statistics for.|

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

### Show statistics for a specific snapshot

```kusto
.show graph_snapshot MyGraphModel.snapshot1 statistics
```

#### Output

|DatabaseName|ModelName|ModelId|Name|SnapshotTime|TotalCpu|MemoryPeak|Duration|NodesCount|EdgesCount|NodesSize|EdgesSize|Details|
|--|--|--|--|--|--|--|--|--|--|--|--|--|
|MyDatabase|MyGraphModel|a1b2c3d4-e5f6-7890-abcd-ef1234567890|snapshot1|2025-09-10T10:30:00.000Z|00:00:15.250|104857600|00:00:25.500|1000000|2500000|536870912|1073741824|{"Steps":[...],"Seal":{...}}|

### Show statistics for a snapshot with detailed steps

The `Details` column contains a JSON object with information about the processing steps:

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
    },
    {
      "Kind": "AddNodes",
      "StepNumber": 2,
      "Status": "Completed",
      "Duration": "00:00:00.6202220",
      "StartTime": "2025-09-04T12:15:39.2880152Z",
      "AddedElementsCount": 2,
      "AddedElementsSizeDelta": 1547,
      "TotalCpu": "00:00:00.7343750",
      "MemoryPeak": 2158192
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

- The command returns statistics only for the specified snapshot
- If the snapshot doesn't exist, the command throws an exception
- Statistics include both processing metrics and final graph structure information
- The `Details` column provides a step-by-step breakdown of the snapshot creation process
- The command fails if the specified graph model doesn't exist
- Only completed steps are shown. If a retry occurs, failed steps are not displayed

## Related commands

- [.show graph_snapshots statistics](graph-snapshots-statistics-show.md)
- [.show graph_snapshots failures](graph-snapshots-failures-show.md)
- [.show graph_snapshot](graph-snapshot-show.md)
