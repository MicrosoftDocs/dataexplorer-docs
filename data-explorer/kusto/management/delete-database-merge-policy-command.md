---
title: .delete database merge policy command- Azure Data Explorer
description: This article describes the .delete database merge policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 09/29/2021
---
# .delete database merge policy

Delete a database's [merge policy](mergepolicy.md). The merge policy defines if and how [Extents (Data Shards)](../management/extents-overview.md) in the cluster should get merged. 
 

## Syntax

`.delete` `database` *DatabaseName* `policy` `merge` 

### Example

Delete the policy at the database level:

```kusto
.delete database database_name policy merge 
```
