---
title: .alter table retention policy command- Azure Data Explorer
description: This article describes the .alter table retention policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 10/03/2021
---
# .alter table retention policy

Change a table's [retention policy](retentionpolicy.md). The retention policy controls the mechanism that automatically removes data from tables or materialized views. It's used to remove data whose relevance is age-based. 
 

## Syntax

`.alter` `table` *TableName* `policy` `retention` 

### Example

Sets a retention policy with a 10 day soft-delete period, and enable data recoverability:

```kusto
.alter table Table1 policy retention "{\"SoftDeletePeriod\": \"10.00:00:00\", \"Recoverability\": \"Enabled\"}"
```
