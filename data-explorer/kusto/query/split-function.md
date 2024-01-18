---
title:  split()
description: Learn how to use the split() function to split the source string according to a given delimiter.
ms.reviewer: alexans
ms.topic: reference
ms.date: 07/25/2023
adobe-target: true
---
# split()

The `split()` function takes a string and splits it into substrings based on a specified delimiter, returning the substrings in an array. Optionally, you can retrieve a specific substring by specifying its index.

## Syntax

`split(`*source*`,` *delimiter* [`,` *requestedIndex*]`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *source* | string |  :heavy_check_mark: | The source string that is split according to the given delimiter.|
| *delimiter* | string |  :heavy_check_mark: | The delimiter that will be used in order to split the source string.|
| *requestedIndex* | int | | A zero-based index. If provided, the returned string array contains the requested substring at the index if it exists.|

## Returns

An array of substrings obtained by separating the *source* string by the specified *delimiter*, or a single substring at the specified *requestedIndex*.

[!INCLUDE [dynamic-access](../../includes/dynamic-access.md)]

## Examples

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA22OQQrAIAwE731FyKlCQPqeIsF4EkqR1v/TWAvS4F43s5ly5bMuoLnLkeuKMbIIEiCjIxjxHnYtkVDr8CcaIpxS6hzB1tCXEHs9mR77Zph5ZvKpqEmTsS4iXUP/upm9tuEBNARoOvUAAAA=" target="_blank">Run the query</a>

```kusto
print
    split("aa_bb", "_"),           // ["aa","bb"]
    split("aaa_bbb_ccc", "_", 1),  // ["bbb"]
    split("", "_"),                // [""]
    split("a__b", "_"),            // ["a","","b"]
    split("aabbcc", "bb")          // ["aa","cc"]
```

|print_0|print_1|print_2|print_3|print4|
|--|--|--|--|--|
|["aa","bb"] |["bbb"] |[""] |["a","","b"] |["aa","cc"]
