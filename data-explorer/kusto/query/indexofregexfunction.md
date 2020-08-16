---
title: indexof_regex() - Azure Data Explorer
description: This article describes indexof_regex() in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/13/2020
---
# indexof_regex()

Function reports the zero-based index of the first occurrence of a specified string within the input string. Plain string matches don't overlap.

See [`indexof()`](indexoffunction.md).

## Syntax

`indexof_regex(`*source*`,`*lookup*`[,`*start_index*`[,`*length*`[,`*occurrence*`]]])`

## Arguments

|Arguments     | Description                                     |Required or Optional|
|--------------|-------------------------------------------------|--------------------|
|source        | Input string                                    |Required            |
|lookup        | String to seek                                  |Required            |
|start_index   | Search start position                           |Optional            |
|length        | Number of character positions to examine. -1 defines an unlimited length |Optional            |
|occurrence    | Find the index of the N-th appearance of the pattern. 
                 Default is 1, the index of the first occurrence |Optional            |

## Returns

Zero-based index position of *lookup*.

* Returns -1 if the string isn't found in the input.
* Returns *null* if:
     * start_index is less than 0.
     * occurrence is less than 0.
     * length parameter is less than -1.


## Examples

```kusto
print
 idx1 = indexof_regex("abcabc", "a.c") // lookup found in input string
 , idx2 = indexof_regex("abcabcdefg", "a.c", 0, 9, 2)  // lookup found in input string
 , idx3 = indexof_regex("abcabc", "a.c", 1, -1, 2)  // there is no second occurrence in the search range
 , idx4 = indexof_regex("ababaa", "a.a", 0, -1, 2)  // Plain string matches do not overlap so full lookup can't be found
 , idx5 = indexof_regex("abcabc", "a|ab", -1)  // invalid input
```

|idx1|idx2|idx3|idx4|idx5|
|----|----|----|----|----|
|0   |3   |-1  |-1  |    |
