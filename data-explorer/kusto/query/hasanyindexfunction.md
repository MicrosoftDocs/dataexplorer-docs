---
title: has_any_index() - Azure Data Explorer
description: This article describes has_any_index() in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: atefsawaed
ms.service: data-explorer
ms.topic: reference
ms.date: 19/08/2021
---
# has_any_index()

Returns the index of the first value found from a specified list that appears withing the input string.

## Syntax

`has_any_index(`*str*,*arr*`)`

## Arguments

* *str*: Input string to search.
* *arr*: List of values to search for.

## Returns

The index of the first element in the array *arr* that the string *str* has matched.
Returns -1 if none of the values were found in the string or if *arr* is null or empty.

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
