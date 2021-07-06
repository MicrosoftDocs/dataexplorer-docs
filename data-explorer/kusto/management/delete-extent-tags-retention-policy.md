---
title: Delete extent tags retention policy management - Azure Data Explorer
description: This article describes the delete extent tags retention policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 07/01/2021
---
# .delete extent tags retention policy

Deletes a table-level or database-level extent tags retention policy. For more information, see [extent tags retention policy](extenttagsretentionpolicy.md).

## Syntax

```kusto
.delete table table_name policy extent_tags_retention

.delete database database_name policy extent_tags_retention
```

## Returns

## Example

Delete the extent tags retention policy for the table named `MyTable`:

```kusto
.delete table MyTable policy extent_tags_retention
```
