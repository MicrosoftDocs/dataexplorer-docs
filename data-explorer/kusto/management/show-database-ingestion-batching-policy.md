---
title: .show database ingestion batching policy command- Azure Data Explorer
description: This article describes the .show database ingestion batching policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 09/27/2021
---
# .show database ingestion batching policy

Display the database ingestion batching policy. The [ingestionBatching policy](batchingpolicy.md) is a policy object that determines when data aggregation should stop during data ingestion according to the specified settings.

## Syntax

* `.show` `database` *DatabaseName* `policy` `ingestionbatching`

## Arguments

*DatabaseName* - Specify the name of the database.

## Example

The following example shows the IngestionBatching policy:

```kusto
// Show IngestionBatching policy for table database `MyDatabase`
.show MyDatabase policy ingestionbatching 
```
