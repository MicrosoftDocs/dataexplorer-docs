---
title: ".delete database ingestion batching policy management command - Azure Data Explorer"
description: "This article describes the .delete database ingest batching policy command in Azure Data Explorer."
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 12/13/2021
---
# .delete database batching policy

Remove the database [ingestion batching policy](batchingpolicy.md) that defines data aggregation for batching.

## Syntax

`.delete` `database` *DatabaseName* `policy` `ingestionbatching`

## Arguments

*DatabaseName* - Specify the name of the database.

## Example

The following command deletes the batching policy on a database.

```kusto
.delete database MyDatabase policy ingestionbatching
```

## Next steps

* [delete table batching policy](delete-table-batching-policy-command.md)