---
title: has_any_index() - Azure Data Explorer
description: This article describes has_any_index() in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: atefsawaed
ms.service: data-explorer
ms.topic: reference
ms.date: 08/19/2021
---
# has_any_index()

Searches the string for items specified in the array and returns the position of the first item found in the string.

## Syntax

`has_any_index(`*str*, *arr*`)`

## Arguments

* *str*: Input string to search.
* *array*: List of values to search for.

## Returns

The index of the first element in *array* that the string *str* has matched.
Returns -1 if none of the values were found or if *array* is empty.

## Example

```kusto
print
 idx1 = has_any_index("this is an example", dynamic(['this', 'example']))  // first lookup found in input string
 , idx2 = has_any_index("this is an example", dynamic(['not', 'example'])) // last lookup found in input string
 , idx3 = has_any_index("this is an example", dynamic(['not', 'found'])) // no lookup found in input string
 , idx4 = has_any_index("Example number 2", range(1, 3, 1)) // Lookup array of integers
 , idx5 = has_any_index("this is an example", dynamic([]))  // Empty lookup array
```

|idx1|idx2|idx3|idx4|idx5|
|----|----|----|----|----|
|0   |3   |-1  |1  | -1  |
