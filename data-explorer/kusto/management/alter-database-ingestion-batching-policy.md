---
title: ".alter database ingestion batching policy command - Azure Data Explorer"
description: "This article describes the .alter database ingestion batching policy command in Azure Data Explorer."
ms.reviewer: yonil
ms.topic: reference
ms.date: 01/06/2022
---
# .alter database ingestion batching policy

Set the [ingestion batching policy](batchingpolicy.md) to determine when data aggregation stops and a batch is sealed and ingested. The policy applies at the database or table level.

If the policy is set to `null`, the [default](batchingpolicy.md#defaults-and-limits) values apply.

## Syntax

`.alter` `database` *DatabaseName* `policy` `ingestionbatching` *PolicyObject*

## Arguments

- *DatabaseName* - Specify the name of the database.
- *PolicyObject* - Define a policy object. For more information, see [ingestion batching policy](batchingpolicy.md).

## Example

The following command sets a batch ingress data time of 30 seconds, for 500 files, or 1 GB, whichever comes first.

```kusto
.alter database MyDatabase policy ingestionbatching @'{"MaximumBatchingTimeSpan":"00:00:30", "MaximumNumberOfItems": 500, "MaximumRawDataSizeMB": 1024}'
```

## Next steps

* [alter table batching policy](alter-table-ingestion-batching-policy.md)
