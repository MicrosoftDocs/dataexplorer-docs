---
title: array_sort_asc() - Azure Data Explorer
description: This article describes array_sort_asc() in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: slneimer
ms.service: data-explorer
ms.topic: reference
ms.date: 09/22/2020
---
# array_sort_asc()

Receives one or more arrays. Sorts the first array in ascending order. Orders the remaining arrays to match the reordered first array.

## Syntax

`array_sort_asc(`*array1*[, ..., *argumentN*]`)`

`array_sort_asc(`*array1*[, ..., *argumentN*]`,`*nulls_last*`)`

If *nulls_last* is not provided, a default value of `true` is used.

## Arguments

* *array1...arrayN*: Input arrays.
* *nulls_last*: A bool indicating whether `null`s should be last

## Returns

Returns the same number of arrays as in the input, so that the first one is sorted in ascending order, and the others are ordered to match the reordered first array.

`null` will be returned for every array that differs in length from the first one.

If the array contains elements of different types, then it will be sorted in the following order:

* Numeric, `datetime` and `timespan` elmeents
* String elements
* Guid elements
* All other elements

## Example 1

<!-- csl: https://help.kusto.windows.net:443/Samples -->
```kusto
let array1 = dynamic([1,3,4,5,2]);
let array2 = dynamic(["a","b","c","d","e"]);
print array_sort_asc(array1,array2)
```

|array1_sorted|array2_sorted|
|---|---|
|[1,2,3,4,5]|["a","e","b","c","d"]|

## Example 2

<!-- csl: https://help.kusto.windows.net:443/Samples -->
```kusto
datatable(command:string, command_time:datetime, user_id:string)
[
	'chmod',		datetime(2019-07-15),	"user1",
	'ls',			datetime(2019-07-02),	"user1",
	'dir',			datetime(2019-07-22),	"user1",
	'mkdir',		datetime(2019-07-14),	"user1",
	'rm',			datetime(2019-07-27),	"user1",
	'pwd',			datetime(2019-07-25),	"user1",
	'rm',			datetime(2019-07-23),	"user2",
	'pwd',			datetime(2019-07-25),	"user2",
]
| summarize timestamps = make_list(command_time), commands = make_list(command) by user_id
| project user_id, commands_in_chronological_order = array_sort_asc(timestamps, commands)[1]
```

|`user_id`|`commands_in_chronological_order`|
|---|---|
|user1|[<br>  "ls",<br>  "mkdir",<br>  "chmod",<br>  "dir",<br>  "pwd",<br>  "rm"<br>]|
|user2|[<br>  "rm",<br>  "pwd"<br>]|

## See also

If you want the first array to be sorted in descending order, use [array_sort_desc()](arraysortdescfunction.md).
