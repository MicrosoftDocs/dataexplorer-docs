---
title: .show data operations
description: Learn how to use the `.show data operations` command to return data operations that reached a final state. 
ms.reviewer: vrozov
ms.topic: reference
ms.date: 08/22/2024
---
# .show data operations command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Returns a table with data operations that reached a final state. Data operations are available for 30 days from when they ran.

Any operation that results in new extents (data shards) added to the system is considered a data operation.

## Permissions

You must have Database Admin or Database Monitor permissions to see any data operations invoked on your database.

Any user can see their own data operations.

 For more information, see [Kusto role-based access control](../access-control/role-based-access-control.md).

## Syntax

`.show` `data` `operations`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Returns

This command returns a table with the following columns:

| Output parameter | Type   | Description                        |
|------------------|--------|------------------------------------|
|Timestamp |`datetime`|The time when the operation reached its final state. |
|Database |`string`|The database name.|
|Table |`string`|The table name.|
|ClientActivityId |`string`|The operation client activity ID.|
|OperationKind |`string`| One of `BatchIngest`, `SetOrAppend`, `RowStoreSeal`, `MaterializedView`, `QueryAcceleration`, and `UpdatePolicy`.|
|OriginalSize |`long`| The original size of the ingested data. |
|ExtentSize |`long`|The extent size.|
|RowCount |`long`|The number of rows in the extent.|
|ExtentCount |`int`|The number of extents.|
|TotalCpu |`timespan`|The total CPU time used by the data operation.|
|Duration |`timespan`| The duration of the operation.|
|Principal |`string`|The identity that initiated the data operation. |
|Properties |`dynamic`|Additional information about the data operation.|

## Example

The following example returns information about `UpdatePolicy`, `BatchIngest`, and `SetOrAppend` operations.

```kusto
.show data operations
```

**Output**

|Timestamp |Database |Table |ClientActivityId |OperationKind |OriginalSize |ExtentSize |RowCount |ExtentCount |TotalCpu |Duration |Principal |Properties |
|--|--|--|--|--|--|--|--|--|--|--|--|--|
|2024-07-18 15:21:10.5432134|TestLogs|UTResults|DM.IngestionExecutor;abcd1234-1234-1234-abcd-1234abcdce;1|UpdatePolicy|100,829|75,578|279|1|00:00:00.2656250|00:00:28.9101535|aadapp=xxx|{"SourceTable": "UTLogs"}|
|2024-07-18 15:21:12.9481819|TestLogs|UTLogs|DM.IngestionExecutor;abcd1234-1234-1234-abcd-1234abcdce;1|BatchIngest|1,045,027,298|123,067,947|1,688,705|2|00:00:22.9843750|00:00:29.9745733|aadapp=xxx|{"Format": "Csv","NumberOfInputStreams":2}|
|2024-07-18 15:21:16.1095441|KustoAuto|IncidentKustoGPTSummary|cdef12345-6789-ghij-0123-klmn45678|SetOrAppend|1,420|3,190|1|1|00:00:00.0156250|00:00:00.0638211|aaduser=xxx||
