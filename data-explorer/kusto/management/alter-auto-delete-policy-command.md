---
title: .alter auto delete policy command - Azure Data Explorer | Microsoft Docs
description: This article describes the .alter auto delete policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yifats
ms.service: data-explorer
ms.topic: reference
ms.date: 09/26/2021
---
# .alter auto delete policy

Alters the auto delete policy that is applied to a table. For more information, see [auto delete policy](auto-delete-policy.md).

## Syntax

`.alter` `table` *TableName* `policy` `auto_delete`

## Examples

### Change the auto delete policy

Changes the auto delete policy that is applied on the table.

```kusto
.alter table [table_name] policy auto_delete 'policy object, serialized as JSON'
```

### Change table expiration

The following example sets the expiry of a table `T` to `2021-02-01`. The table will be deleted even if there are records in it (noted by `DeleteIfNotEmpty`).

```kusto
.alter table T policy auto_delete @'{ "ExpiryDate" : "2021-02-01", "DeleteIfNotEmpty": true }'
```