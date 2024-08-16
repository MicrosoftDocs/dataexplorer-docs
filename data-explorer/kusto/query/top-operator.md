---
title:  top operator
description: Learn how to use the top operator to return the first specified number of records sorted by the specified column.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/24/2024
---
# top operator

Returns the first *N* records sorted by the specified column.

## Syntax

*T* `| top` *NumberOfRows* `by` *Expression* [`asc` | `desc`] [`nulls first` | `nulls last`]

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *T* | `string` |  :heavy_check_mark: | The tabular input to sort. |
| *NumberOfRows* | `int` |  :heavy_check_mark: | The number of rows of *T* to return.|
| *Expression* | `string` |  :heavy_check_mark: | The scalar expression by which to sort.|
| `asc` or `desc` | `string` | | Controls whether the selection is from the "bottom" or "top" of the range. Default `desc`.
| `nulls first` or `nulls last`  | `string` | | Controls whether null values appear at the "bottom" or "top" of the range. Default for `asc` is `nulls first`. Default for `desc` is `nulls last`.|

> [!TIP]
> `top 5 by name` is equivalent to the expression `sort by name | take 5` both from semantic and performance perspectives.

## Example

Show top three storms with most direct injuries.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5uWqUSjJL1AwVkiqVPDMyyotykwtdsksSk0uAQCehD//JgAAAA==" target="_blank">Run the query</a>

```kusto
StormEvents
| top 3 by InjuriesDirect
```

The below table shows only the relevant column. Run the query above to see more storm details for these events.

|InjuriesDirect|...|
|--|--|
|519|...|
|422|...|
|200|...|

## Related content

* Use [top-nested](top-nested-operator.md) operator to produce hierarchical (nested) top results.
