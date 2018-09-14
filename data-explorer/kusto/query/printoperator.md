---
title: print operator - Azure Kusto | Microsoft Docs
description: This article describes print operator in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# print operator

Evaluates one or more scalar expressions and inserts the results (as a single-row table with as many columns as there are expressions) into the output.

```kusto
banner=strcat("Hello", ", ", "World!")
```

**Syntax**

`print` [*ColumnName* `=`] *ScalarExpression* [',' ...]

**Arguments**

* *ColumnName*: An option name to assign to the output's singular column.
* *ScalarExpression*: A scalar expression to evaluate.

**Returns**

A single-column, single-row, table whose single cell has the value of the evaluated *ScalarExpression*.

**Examples**

The `print` operator is useful as a quick way to evaluate one or more
scalar expressions and make a single-row table out of the resulting values.
For example:

```kusto
print 0 + 1 + 2 + 3 + 4 + 5, x = "Wow!"

print banner=strcat("Hello", ", ", "World!")
```