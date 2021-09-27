---
title: .delete table ingestion batching policy command - Azure Data Explorer
description: This article describes the .delete table ingestion batching policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 09/26/2021
---
# .delete table ingestion batching policy

Delete the table ingestion batching policy. The [ingestionBatching policy](batchingpolicy.md) is a policy object that determines when data aggregation should stop during data ingestion according to specified settings.

## Syntax

* `.delete` `table` *DatabaseName*`.`*TableName* `policy` `ingestionbatching`

## Examples

The following examples delete the table IngestionBatching policy:

```kusto
// Delete IngestionBatching policy for table `MyTable` in database `MyDatabase`
.delete table MyDatabase.MyTable policy ingestionbatching 
```

```kusto
// Delete IngestionBatching policy on table `MyTable`
.delete table MyTable policy ingestionbatching
```