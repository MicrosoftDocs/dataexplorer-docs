---
title: not() - Azure Data Explorer
description: Learn how to use the not() function to reverse the value of its boolean argument.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/05/2023
---
# not()

Reverses the value of its `bool` argument.

```kusto
not(false) == true
```

## Syntax

`not(`*expr*`)`

## Arguments

* *expr*: A `bool` expression to be reversed.

## Returns

Returns the reversed logical value of its `bool` argument.
