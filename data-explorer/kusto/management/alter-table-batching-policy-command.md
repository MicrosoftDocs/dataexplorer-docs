---
title: ".alter table ingestion batching policy management command - Azure Data Explorer"
description: "This article describes the .alter table ingest batching policy command in Azure Data Explorer."
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 12/13/2021
---
# .alter table batching policy

Set the table [ingestion batching policy](batchingpolicy.md) to determine when data aggregation stops and a batch is sealed and ingested. 

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

`.alter` `table` *TableName* `policy` `ingestionbatching` *ArrayOfPolicyObjects*

`.alter` `table` *DatabaseName*`.`*TableName* `policy` `ingestionbatching` *ArrayOfPolicyObjects*

`.alter` `tables` `(`*Table1* `,` *Table2*  `,...` `)` `policy` `ingestionbatching` *ArrayOfPolicyObjects*

## Arguments

*DatabaseName* - Specify the name of the database.

*TableName* - Specify the name of the table.

*ArrayOfPolicyObjects* - An array with one or more policy objects defined.

## Example

The following command sets a batch ingress data time of 30 seconds, for 500 files, or 1 GB, whichever comes first.

```kusto
.alter table MyDatabase.MyTable policy ingestionbatching @'{"MaximumBatchingTimeSpan":"00:00:30", "MaximumNumberOfItems": 500, "MaximumRawDataSizeMB": 1024}'
```

The following command sets a batch ingress data time of 1 minute, for 20 files, or 300 MB, whichever comes first.

```kusto
.alter tables (MyTable1, MyTable2, MyTable3) policy ingestionbatching @'{"MaximumBatchingTimeSpan":"00:01:00", "MaximumNumberOfItems": 20, "MaximumRawDataSizeMB": 300}'
```

## Next steps

* [alter database batching policy](alter-database-batching-policy.md)