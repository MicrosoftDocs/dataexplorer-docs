---
title: .delete database retention policy command- Azure Data Explorer
description: This article describes the .delete database retention policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 10/03/2021
---
# .delete database retention policy

Delete a database's [retention policy](retentionpolicy.md). The retention policy controls the mechanism that automatically removes data from tables or materialized views. It is used to remove data whose relevance is age-based. 
 

## Syntax

`.delete` `database` *DatabaseName* `policy` `retention` 

### Example

Delete a retention policy:

```kusto
.delete database MyDatabase policy retention 
```
