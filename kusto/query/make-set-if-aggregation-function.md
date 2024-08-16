---
title:  make_set_if() (aggregation function)
description: Learn how to use the make_set_if() function to create a dynamic JSON object of a set of distinct values that an expression takes where the predicate evaluates to true.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# make_set_if() (aggregation function)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Creates a `dynamic` array of the set of distinct values that *expr* takes in records for which *predicate* evaluates to `true`.

[!INCLUDE [ignore-nulls](../includes/ignore-nulls.md)]

[!INCLUDE [data-explorer-agg-function-summarize-note](../includes/agg-function-summarize-note.md)]

## Syntax

`make_set_if(`*expr*`,` *predicate* [`,` *maxSize*]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *expr* | `string` |  :heavy_check_mark: | The expression used for the aggregation calculation. |
| *predicate* | `string` |  :heavy_check_mark: | A predicate that has to evaluate to `true` in order for *expr* to be added to the result. |
| *maxSize* | `int` |  | The maximum number of elements returned. The default and max value is 1048576. |

## Returns

Returns a `dynamic` array of the set of distinct values that *expr* takes in records for which *predicate* evaluates to `true`. The array's sort order is undefined.

> [!TIP]
> To only count the distinct values, use [dcountif()](dcountif-aggregation-function.md).

## Related content

[`make_set`](make-set-aggregation-function.md) function, which does the same, without predicate expression.

## Example

The following example shows a list of names with more than 4 letters.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAyXNPQvCMBSF4T2/4tDJQBZFUSt1FZxEuomEFG/bYD4gSQfFH++l5U7PO9zjqKBFg5cpfJ2jVTCe6lySDYPi/NGx151NZaxdDIMUDwGgusYxVApHNetmJsdaHxZeKKaBOGx2S7jzs8jei+dJtOKHPHlvkv0SvHmTzlS07edpBd52FGZInLGVf+88QMOkAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
let T = datatable(name:string, day_of_birth:long)
[
   "John", 9,
   "Paul", 18,
   "George", 25,
   "Ringo", 7
];
T
| summarize make_set_if(name, strlen(name) > 4)
```

**Output**

|set_name|
|----|
|["George", "Ringo"]|
