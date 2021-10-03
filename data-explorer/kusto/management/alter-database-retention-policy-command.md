---
title: .alter database retention policy command- Azure Data Explorer
description: This article describes the .alter database retention policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 10/03/2021
---
# .alter database retention policy

Change a database's [retention policy](retentionpolicy.md). The retention policy controls the mechanism that automatically removes data from tables or materialized views. It is used to remove data whose relevance is age-based. 
 

## Syntax

`.alter` `database` *DatabaseName* `policy` `retention` 

### Example

Sets a retention policy with a 10 day soft-delete period, and enable data recoverability:

```kusto
.alter database MyDatabase policy retention "{\"SoftDeletePeriod\": \"10.00:00:00\", \"Recoverability\": \"Enabled\"}"
```
