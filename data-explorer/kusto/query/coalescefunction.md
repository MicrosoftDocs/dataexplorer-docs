---
title: coalesce() (Azure Kusto)
description: This article describes coalesce() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# coalesce()

Evaluates a list of expressions and returns the first non-null (or non-empty for string) expression.

    coalesce(tolong("not a number"), tolong("42"), 33) == 42

**Syntax**

`coalesce(`*expr-1*`, `*expr-2`, ...)

**Arguments**

* *expr-i*: A scalar expression, to be evaluated.

- All arguments must be of the same type.
- Maximum of 64 arguments is supported.


**Returns**

The value of the first *expr-i* whose value is not null (or not-empty for string expressions).

**Example**

```kusto
print result=coalesce(tolong("not a number"), tolong("42"), 33)
```

|result|
|---|
|42|