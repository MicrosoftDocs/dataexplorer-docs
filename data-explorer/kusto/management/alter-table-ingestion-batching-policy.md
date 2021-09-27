---
title: title: .alter table ingestion batching policy command- Azure Data Explorer
command- Azure Data Explorer
description: This article describes the .alter table ingestion batching policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 09/27/2021
---
# .alter table ingestion batching policy

Change the table ingestion batching policy. The [ingestionBatching policy](batchingpolicy.md) is a policy object that determines when data aggregation should stop during data ingestion according to specified settings.

## Syntax

* `.alter` `table` *DatabaseName*`.`*TableName* `policy` `ingestionbatching`

## Examples

The following example changes the table IngestionBatching policy:

```kusto
// Set IngestionBatching policy on multiple tables (in database context) to batch ingress data by 1 minute, 20 files, or 300MB (whatever comes first)
.alter tables (MyTable1, MyTable2, MyTable3) policy ingestionbatching @'{"MaximumBatchingTimeSpan":"00:01:00", "MaximumNumberOfItems": 20, "MaximumRawDataSizeMB": 300}'
```