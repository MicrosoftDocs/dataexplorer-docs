---
title:  bag_merge() 
description: Learn how to use the bag_merge() function to merge property bags.
ms.reviewer: elgevork
ms.topic: reference
ms.date: 11/23/2022
---
# bag_merge()

The function merges multiple `dynamic` property bags into a single `dynamic` property bag object, consolidating all properties from the input bags.

## Syntax

`bag_merge(`*bag1*`,`*bag2*`[`,`*bag3*, ...])`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
| -- | -- | -- | -- |
| *bag1...bagN* | `dynamic` |  :heavy_check_mark: | The property bags to merge. The function accepts between 2 to 64 arguments. |

## Returns

A `dynamic` property bag containing the merged results of all input property bags. If a key is present in multiple input bags, the value associated with the key from the leftmost argument takes precedence.

## Example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShKLS7NKVGwVUhKTI/PTS1KT9XgUlBQSKnMS8zNTNaoVnc0VLcyNNJRUHcCMkC0M5A2rtXUQVNmpG5lYQhSBmKA1IE11mpqAgDRMHuwaAAAAA==" target="_blank">Run the query</a>

```kusto
print result = bag_merge(
   dynamic({'A1':12, 'B1':2, 'C1':3}),
   dynamic({'A2':81, 'B2':82, 'A1':1}))
```

**Output**

|result|
|---|
|{<br>  "A1": 12,<br>  "B1": 2,<br>  "C1": 3,<br>  "A2": 81,<br>  "B2": 82<br>}|
