---
title: strcat-array() (Azure Kusto)
description: This article describes strcat-array() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# strcat-array()

Creates a concatenated string of array values using specified delimeter.
    
**Syntax**

`strcat-array(`*array*, *delimiter*`)`

**Arguments**

* *array*: A `dynamic` value representing an array of values to be concatenated.
* *delimeter*: A `string` value that will be used to concatenate the values in *array*

**Returns**

Array values, concatenated to a single string.

**Examples**
  
```kusto
print str = strcat-array(dynamic([1, 2, 3]), "->")
```

|str|
|---|
|1->2->3|