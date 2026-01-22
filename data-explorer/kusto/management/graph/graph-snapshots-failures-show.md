---
title: .show graph_snapshots failures command
description: Learn how to display failed graph snapshots using the .show graph_snapshots failures command with syntax, parameters, and examples.
ms.reviewer: vilauzon
ms.topic: reference
ms.date: 09/10/2025
---

# .show graph_snapshots failures (preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

> [!NOTE]
> This feature is currently in public preview. Functionality and syntax are subject to change before General Availability.

Displays information about failed graph snapshot creation attempts, including failure reasons, error details, and resource consumption statistics.

## Permissions

You must have at least [Database User, Database Viewer, or Database Monitor](../../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.show` `graph_snapshots` *GraphModelName* `failures`

`.show` `graph_snapshots` `*` `failures`

[Learn more about syntax conventions](../../query/syntax-conventions.md).

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*GraphModelName*|`string`|✅|The name of the graph model to display failed snapshots for. If not specified, use `*` to show failures for all graph models.|

## Returns

This command returns a table with the following columns:

|Column|Type|Description|
|--|--|--|
|*OperationId*|`guid`|The unique identifier of the failed operation.|
|*DatabaseName*|`string`|The name of the database containing the graph model.|
|*ModelName*|`string`|The name of the graph model.|
|*ModelId*|`guid`|The unique identifier of the graph model.|
|*Name*|`string`|The name of the snapshot that failed to be created.|
|*SnapshotTime*|`datetime`|The time when the snapshot creation was attempted.|
|*TotalCpu*|`timespan`|The total CPU time consumed before the failure occurred.|
|*MemoryPeak*|`long`|The peak memory usage (in bytes) before the failure occurred.|
|*Duration*|`timespan`|The duration of the operation before it failed.|
|*FailureReason*|`string`|The detailed error message explaining why the snapshot creation failed.|
|*FailureKind*|`string`|The category or type of failure that occurred.|
|*Details*|`string`|JSON object containing detailed step-by-step statistics up to the point of failure.|

## Examples

### Show all failed snapshots for a graph model

```kusto
.show graph_snapshots MyGraphModel failures
```

#### Output

|OperationId|DatabaseName|ModelName|ModelId|Name|SnapshotTime|TotalCpu|MemoryPeak|Duration|FailureReason|FailureKind|Details|
|--|--|--|--|--|--|--|--|--|--|--|--|
|f47ac10b-58cc-4372-a567-0e02b2c3d479|MyDatabase|MyGraphModel|a1b2c3d4-e5f6-7890-abcd-ef1234567890|failed_snapshot1|2025-09-10T12:15:00.000Z|00:00:08.250|67108864|00:00:12.500|.make graph_snapshot 'failed_snapshot1' from 'MyGraphModel' command failed during processing step 3 with error...|Permanent|{"Steps":[...]}|
|e58bd11c-69dd-5483-b678-1f13c3d4e580|MyDatabase|MyGraphModel|a1b2c3d4-e5f6-7890-abcd-ef1234567890|failed_snapshot2|2025-09-10T16:30:00.000Z|00:00:05.000|33554432|00:00:07.750|.make graph_snapshot 'failed_snapshot2' from 'MyGraphModel' command failed during processing step 17 with error...|Transient|{"Steps":[...]}|
|a9c8d7e6-1234-5678-9abc-def012345678|MyDatabase|MyGraphModel|a1b2c3d4-e5f6-7890-abcd-ef1234567890|failed_snapshot2|2025-09-10T16:30:00.000Z|00:00:03.125|25165824|00:00:05.250|.make graph_snapshot 'failed_snapshot2' from 'MyGraphModel' command failed during processing step 20 with error...|Permanent|{"Steps":[...]}|

### Show failures for all graph models

```kusto
.show graph_snapshots * failures
```

This command returns all failed snapshot creation attempts across all graph models in the database, which is useful for system-wide troubleshooting and failure pattern analysis.

### Analyzing failure details

The `Details` column provides information about completed and failed steps. Each step can have one of several statuses:

- **Completed**: The step executed successfully
- **Failed**: The step encountered an error and couldn't complete
- **Resumed**: The step was already completed in a previous operation attempt and was resumed without re-execution

#### Initial failure example

```json
{
  "Steps": [
    {
      "Kind": "AddEdges",
      "StepNumber": 0,
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
      "StepNumber": 1,
      "Status": "Failed",
      "Duration": "00:00:00.2027214",
      "StartTime": "2025-09-04T12:15:34.4882548Z",
      "TotalCpu": "00:00:00.2031250",
      "MemoryPeak": 0
    }
  ]
}
```

#### Retry operation example

If there's a retry, finished steps from previous operations are resumed and not executed again.

**Important**: Steps can only be resumed if:

- The graph model definition didn't change since the previous attempt
- The `FailureKind` is `Transient` (indicating the failure might succeed if retried)

If the graph model was modified or the failure is `Permanent`, all steps must be re-executed from the beginning.

```json
{
  "Steps": [
    {
      "Kind": "AddNodes",
      "StepNumber": 0,
      "Status": "Resumed",
      "Duration": "00:00:00.0003329",
      "StartTime": "2025-09-04T12:15:39.2846214Z",
      "TotalCpu": "00:00:00",
      "MemoryPeak": 0
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
      "Status": "Failed",
      "Duration": "00:00:00.2027214",
      "StartTime": "2025-09-04T12:15:34.4882548Z",
      "TotalCpu": "00:00:00.2031250",
      "MemoryPeak": 0
    }
  ]
}
```

Note how step 0 shows `Status: "Resumed"` with minimal duration and zero resource consumption, indicating it was restored from a previous successful execution rather than re-executed.

### Troubleshooting failures

#### Using operation identifiers (IDs) for detailed investigation

Each failed operation has a unique `OperationId` that can be used to get more detailed information about the failure:

```kusto
.show operations f47ac10b-58cc-4372-a567-0e02b2c3d479
```

This command provides comprehensive details about the operation execution, including detailed error messages and execution timeline.

#### Understanding failure classifications

**FailureKind** indicates the nature of the failure:

- **Permanent**: The failure is unlikely to succeed if retried without changes (for example, missing tables, schema mismatches)
- **Transient**: The failure might succeed if retried (for example, temporary resource constraints, network issues)

**FailureReason** provides the specific error message from the failed step in the operation, helping identify the exact cause of the failure.

## Notes

- Only failed snapshot creation attempts are included in the results
- The command returns an empty result set if no failures exist
- The command fails if the specified graph model doesn't exist

## Related commands

- [.show graph_snapshot statistics](graph-snapshot-statistics-show.md)
- [.show graph_snapshots statistics](graph-snapshots-statistics-show.md)
- [.show graph_snapshots](graph-snapshots-show.md)
- [.show operations](../show-operations.md)
