---
title: .show database retention policy command- Azure Data Explorer
description: This article describes the .show database retention policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 10/03/2021
---
# .show database retention policy

Display a database's [retention policy](retentionpolicy.md). The retention policy controls the mechanism that automatically removes data from tables or materialized views. It's used to remove data whose relevance is age-based. 
 

## Syntax

`.show` `database` *DatabaseName* `policy` `retention` 

### Example

Display a retention policy:

```kusto
.show database MyDatabase policy retention 
```
