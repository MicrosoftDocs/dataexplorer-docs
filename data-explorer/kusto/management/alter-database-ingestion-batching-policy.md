---
title:  .alter database policy ingestionbatching command
description: Learn how to use the `.alter database policy ingestionbatching` command to set the ingestion batching policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/25/2023
---
# .alter database policy ingestionbatching command

Sets the [ingestion batching policy](batchingpolicy.md). The ingestion batching policy determines when data aggregation stops and a batch is sealed and ingested.

When setting the policy for a database, it applies for all its tables, except tables that were set with their own IngestionBatching policy. If the policy isn't set for a database, the [default values](batchingpolicy.md#defaults-and-limits) apply.

## Permissions

You must have at least [Database Admin](access-control/role-based-access-control.md) permissions to run this command.

## Defaults and limits

See [defaults and limits](batchingpolicy.md#defaults-and-limits).

## Syntax

`.alter` `database` *DatabaseName* `policy` `ingestionbatching` *PolicyObject*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*|string|&check;|The name of the database for which to alter the ingestion batching policy.|
|*PolicyObject*|string|&check;|A policy object that defines the ingestion batching policy. For more information, see [ingestion batching policy](batchingpolicy.md).|

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
> If you don't specify all parameters of a *PolicyObject*, the unspecified parameters will be set to [default values](batchingpolicy.md#sealing-a-batch). For example, specifying only "MaximumBatchingTimeSpan" will result in "MaximumNumberOfItems" and "MaximumRawDataSizeMB" being set to default.

## Next steps

- [alter table batching policy](alter-table-ingestion-batching-policy.md)
