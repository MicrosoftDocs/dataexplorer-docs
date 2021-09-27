---
title: .show table ingestion batching policy command- Azure Data Explorer
description: This article describes the .show table ingestion batching policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 09/27/2021
---
# .show table ingestion batching policy

Display the table ingestion batching policy. The [ingestionBatching policy](batchingpolicy.md) is a policy object that determines when data aggregation should stop during data ingestion according to specified settings.

## Syntax

* `.show` `table` *DatabaseName*`.`*TableName* `policy` `ingestionbatching`

## Example

The following example shows the IngestionBatching policy:

```kusto
// Show IngestionBatching policy for table `MyTable` in database `MyDatabase`
.show table MyDatabase.MyTable policy ingestionbatching 
```
