---
title: .delete table retention policy command- Azure Data Explorer
description: This article describes the .delete table retention policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 10/03/2021
---
# .delete table retention policy

Delete a table's [retention policy](retentionpolicy.md). The retention policy controls the mechanism that automatically removes data from tables or materialized views. It's used to remove data whose relevance is age-based. 
 

## Syntax

`.delete` `table` *TableName* `policy` `retention` 

### Example

Delete a retention policy:

```kusto
.delete table Table1 policy retention
```
