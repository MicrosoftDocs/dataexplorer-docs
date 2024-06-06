---
title:  .alter database policy ingestionbatching command
description: Learn how to use the `.alter database policy ingestionbatching` command to set the ingestion batching policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/25/2023
---
# .alter database policy ingestionbatching command

Sets the [ingestion batching policy](batching-policy.md) to determine when data aggregation stops and a batch is sealed and ingested. The ingestion batching policy applies to [queued ingestion](../../ingest-data-overview.md#continuous-data-ingestion).

When setting the policy for a database, it applies for all its tables, except tables that were set with their own ingestion batching policy. If the policy isn't set for a database, the [default values](batching-policy.md#defaults-and-limits) apply.

## Permissions

You must have at least [Database Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Defaults and limits

See [defaults and limits](batching-policy.md#defaults-and-limits).

## Syntax

`.alter` `database` *DatabaseName* `policy` `ingestionbatching` *PolicyObject*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*| `string` | :heavy_check_mark:|The name of the database for which to alter the ingestion batching policy.|
|*PolicyObject*| `string` | :heavy_check_mark:|A policy object that defines the ingestion batching policy. For more information, see [ingestion batching policy](batching-policy.md).|

## Example

The following command sets a batch ingress data time of 30 seconds, for 500 files, or 1 GB, whichever comes first.

````kusto
.alter database MyDatabase policy ingestionbatching
```
{
    "MaximumBatchingTimeSpan" : "00:00:30",
    "MaximumNumberOfItems" : 500,
    "MaximumRawDataSizeMB" : 1024
}
```
````

>[!NOTE]
> If you don't specify all parameters of a *PolicyObject*, the unspecified parameters will be set to [default values](batching-policy.md#sealing-a-batch). For example, specifying only "MaximumBatchingTimeSpan" will result in "MaximumNumberOfItems" and "MaximumRawDataSizeMB" being set to default. To override only some parameters, use the [alter-merge command](alter-merge-database-ingestion-batching-policy.md) command.

## Related content

- [.alter table ingestionbatching policy](alter-table-ingestion-batching-policy.md)
