---
title:  .alter-merge database policy ingestionbatching command
description: Learn how to use the `.alter-merge database policy ingestionbatching` command to set the ingestion batching policy.
ms.reviewer: slneimer
ms.topic: reference
ms.date: 08/27/2023
---
# .alter-merge database policy ingestionbatching command

Sets the [ingestion batching policy](batching-policy.md) to determine when data aggregation stops and a batch is sealed and ingested. The ingestion batching policy applies to [queued ingestion](../../ingest-data-overview.md#queued-vs-streaming-ingestion).

When setting the policy for a database, it applies for all its tables, except tables that were set with their own ingestion batching policy. If the policy isn't set for a database, the [default values](batching-policy.md#defaults-and-limits) apply.

## Permissions

You must have at least [Database Admin](access-control/role-based-access-control.md) permissions to run this command.

## Defaults and limits

See [defaults and limits](batching-policy.md#defaults-and-limits).

## Syntax

`.alter-merge` `database` *DatabaseName* `policy` `ingestionbatching` *PolicyObject*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*|string|&check;|The name of the database for which to alter the ingestion batching policy.|
|*PolicyObject*|string|&check;|A policy object that defines the ingestion batching policy. For more information, see [ingestion batching policy](batching-policy.md).|

## Examples

The following command sets a batch ingress data time of 30 seconds, for 500 files, or 1 GB, whichever comes first.

````kusto
.alter-merge database MyDatabase policy ingestionbatching
```
{
    "MaximumBatchingTimeSpan" : "00:00:30",
    "MaximumNumberOfItems" : 500,
    "MaximumRawDataSizeMB" : 1024
}
```
````

The following command sets a batch ingress data time of 45 seconds, for 450 files, or the previous value of MaximumRawDataSizeMB, whichever comes first.

````kusto
.alter-merge database MyDatabase policy ingestionbatching
```
{
    "MaximumBatchingTimeSpan" : "00:00:45",
    "MaximumNumberOfItems" : 450
}
```
````

>[!NOTE]
> If you specify only some parameters of a *PolicyObject*, these parameters will replace the values in the current policy, while the other parameters will remain intact. To set the [default values](batching-policy.md#sealing-a-batch) for unspecified parameters, use the [alter command](alter-database-ingestion-batching-policy.md) command.

## Related content

* [.alter-merge table ingestionbatching policy](alter-merge-table-ingestion-batching-policy.md)
