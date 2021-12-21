---
title: ".show table ingestion batching policy command- Azure Data Explorer"
description: "This article describes the .show table ingestion batching policy command in Azure Data Explorer."
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 09/27/2021
---
# .show table ingestion batching policy

DDisplay the table [ingestion batching policy](batchingpolicy.md) that defines data aggregation for batching.

## Syntax

`.show` `table` *TableName* `policy` `ingestionbatching`

## Arguments

*TableName* - Specify the name of the table.

## Returns

Returns a JSON representation of the policy.

## Example

The following command will return the batching policy on a table.

```kusto
.show table MyTable policy ingestionbatching
```

## Next steps

* [show database batching policy](show-database-ingestion-batching-policy.md)