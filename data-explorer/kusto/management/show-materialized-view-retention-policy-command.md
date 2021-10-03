---
title: .show materialized-view retention policy command- Azure Data Explorer
description: This article describes the .show materialized-view retention policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 10/03/2021
---
# .show materialized-view retention policy

Display a materialized-view's [retention policy](retentionpolicy.md). The retention policy controls the mechanism that automatically removes data from tables or materialized views. It is used to remove data whose relevance is age-based. 

## Syntax

`.show` `materialized-view` *DatabaseName* `policy` `retention` 

### Example

Displays a retention policy:

```kusto
.show materialized-view MyMaterializedView policy retention 
```
