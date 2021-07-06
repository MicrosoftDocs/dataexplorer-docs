---
title: Show extent tags retention policy management - Azure Data Explorer
description: This article describes the show extent tags command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 07/01/2021
---
# .show extent tags retention policy

Shows a table-level or database-level extent tags retention policy. For more information, see [extent tags retention policy](extenttagsretentionpolicy.md).

## Syntax

```kusto
.show table table_name policy extent_tags_retention

.show database database_name policy extent_tags_retention
```

## Returns

## Example

Show the extent tags retention policy for the database named `MyDatabase`:

```kusto
.show database MyDatabase policy extent_tags_retention
```
