---
title: indexof() - Azure Data Explorer | Microsoft Docs
description: This article describes indexof() in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 10/23/2018
---
# indexof()

Function reports the zero-based index of the first occurrence of a specified string within input string.

If lookup or input string is not of string type - forcibly casts the value to string.

**Syntax**

`indexof(`*source*`,`*lookup*`[,`*start_index*`[,`*length*`]])`

**Arguments**

* *source*: input string.  
* *lookup*: string to seek.
* *start_index*: search start position (optional).
* *length*: number of character positions to examine (optional).

**Returns**

Zero-based index position of *lookup*.

Returns -1 if the string is not found in the input.

In case of irrelevant (less than 0) *start_index* or *length* parameter - returns *null*.

**Examples**
```kusto
print
 idx1 = indexof("abcdefg","cde")    // lookup found in input string
 , idx2 = indexof("abcdefg","cde",1,4) // lookup found in researched range 
 , idx3 = indexof("abcdefg","cde",1,2) // search starts from index 1, but stops after 2 chars, so full lookup can't be found
 , idx4 = indexof("abcdefg","cde",3,4) // search starts after occurrence of lookup
 , idx5 = indexof("abcdefg","cde",-1)  // invalid input
 , idx6 = indexof(1234567,5,1,4)       // two first parameters were forcibly casted to strings "12345" and "5"
```

|idx1|idx2|idx3|idx4|idx5|idx6|
|----|----|----|----|----|----|
|2   |2   |-1  |-1  |    |4   |
