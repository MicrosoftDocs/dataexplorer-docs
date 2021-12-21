---
title: ".alter database ingestion batching policy command - Azure Data Explorer"
description: "This article describes the .alter database ingestion batching policy command in Azure Data Explorer."
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 12/15/2021
---
# .alter database ingestion batching policy

Set the [ingestion batching policy](batchingpolicy.md) to determine when data aggregation stops and a batch is sealed and ingested. The policy applies at the database or table level.

If the policy is set to `null`, default values are used. Default values are:

* Batch time of 5 minutes
* 1000 items
* Total size of 1 GB
* Or default cluster settings

## Ingestion batching limits

| Type | Default | Minimum | Maximum
|---|---|---|---|
| Number of items | 1000 | 1 | 2000 |
| Data size (MB) | 1000 | 100 | 1000 |
| Time | 5 minutes | 10 seconds | 15 minutes |

## Syntax

`.alter` `database` *DatabaseName* `policy` `ingestionbatching` *ArrayOfPolicyObjects*

## Arguments

*DatabaseName* - Specify the name of the database.

*ArrayOfPolicyObjects* - An array with one or more policy objects defined.

## Example

The following command sets a batch ingress data time of 30 seconds, for 500 files, or 1 GB, whichever comes first.

```kusto
.alter database MyDatabase policy ingestionbatching @'{"MaximumBatchingTimeSpan":"00:00:30", "MaximumNumberOfItems": 500, "MaximumRawDataSizeMB": 1024}'
```

## Next steps

* [alter table batching policy](alter-table-ingestion-batching-policy.md)