---
title:  .alter-merge table policy ingestionbatching command
description: Learn how to use the `.alter-merge table policy ingestionbatching` command to set the table's ingestion batching policy.
ms.reviewer: slneimer
ms.topic: reference
ms.date: 08/27/2023
---
# .alter-merge table policy ingestionbatching command

Sets the table's [ingestion batching policy](batchingpolicy.md) to determine when data aggregation stops and a batch is sealed and ingested. The ingestion batching policy applies to [queued ingestion](../../ingest-data-overview.md#queued-vs-streaming-ingestion).

If the policy isn't set for a table, the database-level policy applies. If the policy isn't set at the database-level, the [default values](batchingpolicy.md#defaults-and-limits) apply.

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Defaults and limits

See [defaults and limits](batchingpolicy.md#defaults-and-limits).

## Syntax

`.alter-merge` `table` [ *DatabaseName*`.`]*TableName* `policy` `ingestionbatching` *PolicyObject*

`.alter-merge` `tables` `(`*Table1* `,` *Table2*  [`,`...]`)` `policy` `ingestionbatching` *PolicyObject*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *TableName* | string | &check; | The name of the table to alter.|
| *DatabaseName* | string | | The name of the database. When you run the command from the database context that contains the table to alter, *DatabaseName* is not required.|
| *PolicyObject* |string|&check;| A serialized JSON policy object. See [ingestion batching policy](batchingpolicy.md).|

## Examples

The following command sets a batch ingress data time of 30 seconds, for 500 files, or 1 GB, whichever comes first.

````kusto
.alter-merge table MyDatabase.MyTable policy ingestionbatching
```
{
    "MaximumBatchingTimeSpan" : "00:00:30",
    "MaximumNumberOfItems" : 500,
    "MaximumRawDataSizeMB": 1024
}
```
````

The following command sets a batch ingress data time of 45 seconds, for 450 files, or the previous value of MaximumRawDataSizeMB, whichever comes first.

````kusto
.alter-merge table MyDataMyDatabase.MyTable policy ingestionbatching
```
{
    "MaximumBatchingTimeSpan" : "00:00:45",
    "MaximumNumberOfItems" : 450
}
```
````

>[!NOTE]
> If you specify only some parameters of a *PolicyObject*, they will replace the values in the current policy, while the other parameters will remain intact. To set the [default values](batchingpolicy.md#sealing-a-batch) for unspecified parameters, use the [alter command](alter-table-ingestion-batching-policy.md) command.

## Related content

* [alter-merge database ingestionbatching policy](alter-merge-database-ingestion-batching-policy.md)
