---
title: .show table row level security policy command- Azure Data Explorer
description: This article describes the .show table row level security policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 10/04/2021
---
# .show table row level security policy

Display a table's [row_level_security policy](rowlevelsecuritypolicy.md). The Row Level Security simplifies the design and coding of security. It lets you apply restrictions on data row access in your application. For example, limit user access to rows relevant to their department, or restrict customer access to only the data relevant to their company.

## Syntax

`.alter` `table` *TableName* `policy` `row-level-security` 

### Examples

Display the policy at the table level:

```kusto
.show table MyTable policy row-level-security
```
