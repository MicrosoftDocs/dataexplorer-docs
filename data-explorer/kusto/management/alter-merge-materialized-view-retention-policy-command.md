---
title: .alter-merge materialized-view retention policy command- Azure Data Explorer
description: This article describes the .alter-merge materialized-view retention policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 10/03/2021
---
# .alter-merge materialized-view retention policy

Change a materialized-view's [retention policy](retentionpolicy.md). The retention policy controls the mechanism that automatically removes data from tables or materialized views. It is used to remove data whose relevance is age-based. 

## Syntax

`.alter-merge` `materialized-view` *DatabaseName* `policy` `retention` 

### Example

Sets a retention policy with a 10 day soft-delete period, and enable data recoverability:

```kusto
.alter-merge materialized-view View1 policy retention softdelete = 10d recoverability = disabled
```
