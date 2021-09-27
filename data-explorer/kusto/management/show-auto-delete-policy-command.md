---
title: The .show auto delete policy command - Azure Data Explorer | Microsoft Docs
description: This article describes the .show auto delete policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yifats
ms.service: data-explorer
ms.topic: reference
ms.date: 09/26/2021
---
# .show auto delete policy

Shows the auto delete policy that is applied to a table. For more information, see [auto delete policy](auto-delete-policy.md).

## Syntax

`.show` `table` *TableName* `policy` `auto_delete`

## Example

Displays the auto delete policy that is applied on the table.

```kusto
.show table [table_name] policy auto_delete
```

|Policy name | Entity name | Policy | Child entities | Entity type
|---|---|---|---|---
|AutoDeletePolicy | Table name | JSON serialization of the policy object | null | Table
