---
title: .show database merge policy command- Azure Data Explorer
description: This article describes the .show database merge policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 09/29/2021
---
# .show database merge policy

Display a database's [merge policy](mergepolicy.md). The merge policy defines if and how [Extents (Data Shards)](../management/extents-overview.md) in the cluster should get merged. 
 

## Syntax

`.show` `database` *DatabaseName* `policy` `merge` 

### Example

Display the policy at the database level:

```kusto
.show database database_name policy merge 
```
