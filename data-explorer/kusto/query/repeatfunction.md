---
title: repeat() - Azure Data Explorer
description: This article describes repeat() in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/17/2023
---
# repeat()

Generates a dynamic array holding a series of equal values.

## Syntax

`repeat(`*value*`,` *count*`)` 

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value* | bool, int, long, real, datetime, or timespan | &check; | The value of the element in the resulting array.|  
| *count* | int | &check; | The count of the elements in the resulting array.|

## Returns

If *count* is equal to zero, a empty array is returned.
If *count* is less than zero, a null value is returned.

## Examples

The following example returns `[1, 1, 1]`:

```kusto
T | extend r = repeat(1, 3)
```