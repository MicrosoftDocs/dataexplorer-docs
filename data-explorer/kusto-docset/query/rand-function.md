---
title:  rand()
description: Learn how to use the rand() function to return a random number.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# rand()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns a random number.

```kusto
rand()
rand(1000)
```

## Syntax

* `rand()` - returns a value of type `real`
  with a uniform distribution in the range [0.0, 1.0).
* `rand(` *N* `)` - returns a value of type `real`
  chosen with a uniform distribution from the set {0.0, 1.0, ..., *N* - 1}.

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]
