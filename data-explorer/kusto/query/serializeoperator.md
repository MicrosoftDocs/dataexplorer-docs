---
title: serialize operator - Azure Kusto | Microsoft Docs
description: This article describes serialize operator in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# serialize operator

Freezes the order of the input row set arbitrarily, so that [window functions](./windowsfunctions.md)
could be applied to it.

```kusto
T | serialize rn=row_number()
```

**Syntax**

`serialize` [*Name1* `=` *Expr1* [`,` *Name2* `=` *Expr2*]...]

* The *Name*/*Expr* pairs are similar to those in the [extend operatpr](./extendoperator.md).

**Example**

```kusto
Traces
| where ActivityId == "479671d99b7b"
| serialize

Traces
| where ActivityId == "479671d99b7b"
| serialize rn = row_number()
```