---
title: title: .delete database ingestion batching policy command- Azure Data Explorer
command- Azure Data Explorer
description: This article describes .delete database ingestion batching policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 09/27/2021
---
# .delete database ingestion batching policy

Delete the database ingestion batching policy. The [ingestionBatching policy](batchingpolicy.md) is a policy object that determines when data aggregation should stop during data ingestion according to specified settings.

## Syntax

* `.delete` `database` *DatabaseName* `policy` `ingestionbatching`

## Example

The following example deletes the database IngestionBatching policy:

```kusto
// Delete IngestionBatching policy on database `MyDatabase`
.delete database MyDatabase policy ingestionbatching
```