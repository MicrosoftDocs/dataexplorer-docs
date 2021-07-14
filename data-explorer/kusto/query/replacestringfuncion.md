---
title: replace_string() - Azure Data Explorer | Microsoft Docs
description: This article describes replace_string() in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 10/23/2018
---
# replace_string()

Replace all string matches with another string. 

## Syntax

`replace_string(`*text*`,` *lookup*`,` *rewrite*`)`

## Arguments

* *text*: A string.
* *lookup*: A string to replace.
* *rewrite*: A string to replace with.

## Returns

*text* after replacing all matches of *lookup* with evaluations of *rewrite*. Matches do not overlap.

## Example

This statement:

```kusto
range x from 1 to 5 step 1
| extend str=strcat('Number is ', tostring(x))
| extend replaced=replace_string(str, 'is', 'was')
```

Has the following results:

| x    | str | replaced|
|---|---|---|
| 1    | Number is 1.000000  | Number was: 1.000000|
| 2    | Number is 2.000000  | Number was: 2.000000|
| 3    | Number is 3.000000  | Number was: 3.000000|
| 4    | Number is 4.000000  | Number was: 4.000000|
| 5    | Number is 5.000000  | Number was: 5.000000|
 