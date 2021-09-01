---
title: Views - Azure Data Explorer | Microsoft Docs
description: This article describes views in Azure Data Explorer.
services: data-explorer
author: zivc
ms.author: zivc
ms.reviewer: orspodek
ms.service: data-explorer
ms.topic: reference
ms.date: 08/26/2021
---
# Views

**Views** are virtual tables based on the result-set of a KQL query.
Just like a real table, a view contains rows and columns. Unlike a real table,
a view does not hold its own data storage.

Views are defined through [user-defined functions](../functions/user-defined-functions.md)
with the following constraints:

1. The result of the function is tabular (e.g., it cannot be a scalar value).

1. The function takes no arguments.

Views can be based on either [stored functions](./stored-functions.md) or defined as part of the query
using a [let statement](../letstatement.md)).

> [!NOTE]
> Technically-speaking, views are not schema entities. All functions that comply
> with the constraints above are regarded as views.

For example, the following query defines and uses a view; note that the view
is used as-if a table called `T` was defined (there's no need to reference the
function `T` using the function call syntax `T()`):

```kusto
let T=() {print x=1, y=2};
T
```

## The `view` keyword

By default, operators such as the [union operator](../unionoperator.md) that support
a wildcard syntax to specify table names will **not** reference views, even if the
view's name matches the wildcard. One can use the `view` keyword to have the view
included as well.

For example, the results of the following query include the `T1` view, but not `T2`:

```kusto
let T1=view (){print Name="T1"};
let T2=(){print Name="T2"};
union T*
```
