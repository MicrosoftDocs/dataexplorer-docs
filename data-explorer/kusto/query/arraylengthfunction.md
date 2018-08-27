---
title: array-length() (Azure Kusto)
description: This article describes array-length() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# array-length()

Calculates the number of elements in a dynamic array.

**Syntax**

`array-length(`*array*`)`

**Arguments**

* *array*: A `dynamic` value.

**Returns**

The number of elements in *array*, or `null` if *array* is not an array.

**Examples**

```kusto
print array-length(parsejson('[1, 2, 3, "four"]')) == 4

print array-length(parsejson('[8]')) == 1

print array-length(parsejson('[{}]')) == 1

print array-length(parsejson('[]')) == 0

print array-length(parsejson('{}')) == null

print array-length(parsejson('21')) == null
```