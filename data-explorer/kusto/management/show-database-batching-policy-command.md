---
title: ".show database ingestion batching policy management command - Azure Data Explorer"
description: "This article describes the .show database ingest batching policy command in Azure Data Explorer."
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 12/13/2021
---
# .show database batching policy

Display the database [ingestion batching policy](batchingpolicy.md) that defines data aggregation for batching.

## Syntax

`.show` `database` *DatabaseName* `policy` `ingestionbatching`

## Arguments

*DatabaseName* - Specify the name of the database.

## Returns

Returns a JSON representation of the policy.

## Example

The following command will return the batching policy on a database.

```kusto
.show database MyDatabase policy ingestionbatching
```

## Next steps

* [show table batching policy](show-table-batching-policy.md)