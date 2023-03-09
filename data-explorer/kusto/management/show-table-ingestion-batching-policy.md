---
title: ".show table ingestion batching policy command- Azure Data Explorer"
description: "This article describes the .show table ingestion batching policy command in Azure Data Explorer."
ms.reviewer: orspodek
ms.topic: reference
ms.date: 03/09/2023
---
# .show table ingestion batching policy

Display the table [ingestion batching policy](batchingpolicy.md) that defines data aggregation for batching.

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

`.show` `table` *TableName* `policy` `ingestionbatching`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*|string|&check;|The name of the table for which to show the policy details.|

## Returns

Returns a JSON representation of the policy.

## Example

The following command will return the batching policy on a table.

```kusto
.show table MyTable policy ingestionbatching
```

## See also

* [show database batching policy](show-database-ingestion-batching-policy.md)
