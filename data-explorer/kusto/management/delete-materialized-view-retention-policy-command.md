---
title: .delete materialized-view retention policy command- Azure Data Explorer
description: This article describes the .delete materialized-view retention policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 10/03/2021
---
# .delete materialized-view retention policy

Delete a materialized-view's [retention policy](retentionpolicy.md). The retention policy controls the mechanism that automatically removes data from tables or materialized views. It is used to remove data whose relevance is age-based. 

## Syntax

`.delete` `materialized-view` *DatabaseName* `policy` `retention` 

### Example

Delete a retention policy:

```kusto
.delete materialized-view MyMaterializedView policy retention
```
