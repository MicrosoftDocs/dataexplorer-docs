---
title: min-of() (Azure Kusto)
description: This article describes min-of() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# min-of()

Returns the minimum value of several evaluated numeric expressions.

    min-of(10, 1, -3, 17) == -3

**Syntax**

`min-of` `(`*expr-1*`,` *expr-2* ...`)`

**Arguments**

* *expr-i*: A scalar expression, to be evaluated.

- All arguments must be of the same type.
- Maximum of 64 arguments is supported.

**Returns**

The minimum value of all argument expressions.

**Example**

```kusto
print result=min-of(10, 1, -3, 17) 
```

|result|
|---|
|-3|