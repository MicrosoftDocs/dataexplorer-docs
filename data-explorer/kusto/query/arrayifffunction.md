---
title: array_iif() - Azure Data Explorer
description: Learn how to use the array_iif() function to scan and evaluate elements in an array.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/20/2022
---
# array_iif()

Element-wise iif function on dynamic arrays.

Another alias: array_iff().

## Syntax

`array_iif(`*condition_array*, *when_true*, *when_false*`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *condition_array*| dynamic | &check;| An array of *boolean* or numeric values.|
| *when_true* |  | &check; | An array of values or primitive value. This will be the result when *condition_array* is *true*.|
| *when_false* |  | &check; | An array of values or primitive value. This will be the result when *condition_array* is *false*.|

> [!NOTE]
>
> * The result length is the length of *condition_array*.
> * Numeric condition value is treated as *condition* != *0*.
> * Non-numeric/null condition value will have null in the corresponding index of the result.
> * Missing values (in shorter length arrays) are treated as null.

## Returns

Returns a dynamic array of the values taken either from the *when_true* or *when_false* [array] values, according to the corresponding value of the condition array.

## Example

[**Run the query**](https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUjOz0vJLMnMz7NNqcxLzM1M1oguKSpN1UlLzClO1QExYzV1FHIQsoY6RjrGILEihJiJjqmOWaymAi9XjUJqRUlqXopCUWqxbWJRUWJlfGZmmgbcFqBRQJ2aACda2uZ8AAAA)

```kusto
print condition=dynamic([true,false,true]), l=dynamic([1,2,3]), r=dynamic([4,5,6]) 
| extend res=array_iif(condition, l, r)
```

|condition|l|r|res|
|---|---|---|---|
|[true, false, true]|[1, 2, 3]|[4, 5, 6]|[1, 5, 3]|
