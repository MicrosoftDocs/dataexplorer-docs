---
title:  strcat_array()
description: Learn how to use the strcat_array() function to create a concatenated string of array values using a specified delimiter. 
ms.reviewer: alexans
ms.topic: reference
ms.date: 07/13/2023
---
# strcat_array()

Creates a concatenated string of array values using a specified delimiter.

## Syntax

`strcat_array(`*array*, *delimiter*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *array* | `dynamic` |  :heavy_check_mark: | An array of values to be concatenated.|
| *delimeter* | `string` |  :heavy_check_mark: | The value used to concatenate the values in *array*.|

## Returns

The input *array* values concatenated to a single string with the specified *delimiter*.

## Examples

### Custom delimeter

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUSguKVKwBZHJiSXxiUVFiZUaKZV5ibmZyRrRhjoKRjoKxrGaOgpKunZKmgBWe4fjMgAAAA==" target="_blank">Run the query</a>

```kusto
print str = strcat_array(dynamic([1, 2, 3]), "->")
```

**Output**

|str|
|---|
|1->2->3|

### Using quotes as the delimeter

To use quotes as the delimeter, enclose the quotes in single quotes.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/kvc9rf7q4d68qcw5sk2d6f.northeurope/databases/MyDatabase?query=H4sIAAAAAAAAAysoyswrUSguKVKwBZHJiSXxiUVFiZUaKZV5ibmZyRrRhjoKRjoKxrGaOgrqSuqaABjzStsxAAAA" target="_blank">Run the query</a>

```kusto
print str = strcat_array(dynamic([1, 2, 3]), '"')
```

**Output**

|str|
|---|
|1"2"3|
