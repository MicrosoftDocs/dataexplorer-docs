---
title: isnotnull() - Azure Data Explorer | Microsoft Docs
description: This article describes isnotnull() in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 02/09/2020
---
# isnotnull()

Returns `true` if the argument is not null.

**Syntax**

`isnotnull(`[*value*]`)`

`notnull(`[*value*]`)` - alias for `isnotnull`

**Example**

```
T | where isnotnull(PossiblyNull) | count
```

Notice that there are other ways of achieving this effect:

```
T | summarize count(PossiblyNull)
```