---
title: The case-sensitive contains_cs string operator - Azure Data Explorer
description: Learn how to use the contains_cs operator to filter a record set for data containing a case-sensitive string.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/11/2023
---
# contains_cs operator

Filters a record set for data containing a case-sensitive string. `contains_cs` searches for arbitrary sub-strings rather than [terms](datatypes-string-operators.md#what-is-a-term).

[!INCLUDE [contains-operator-comparison](../../includes/contains-operator-comparison.md)]

## Performance tips

[!INCLUDE [performance-tip-note](../../includes/performance-tip-note.md)]

If you're looking for a [term](datatypes-string-operators.md#what-is-a-term), use `has_cs` for faster results.

## Syntax

*T* `|` `where` *col* `contains_cs` `(`*string*`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T* | string | &check; | The tabular input whose records are to be filtered. |
| *col* | string | &check; | The name of the column to check for *string*. |
| *string* | string | &check; | The case-sensitive string by which to filter the data. |

## Returns

Rows in *T* for which *string* is in *col*.

## Example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5lIAghqF4tLc3MSizKpUhVSQcHxyfmleiS2Y1NBUSKpUCC5JLEmFKi7PSC1KhYgoJOfnlSRm5hXHJxcrKDkGKwEAd3al+FsAAAA=" target="_blank">Run the query</a>

```kusto
StormEvents
    | summarize event_count=count() by State
    | where State contains_cs "AS"
```

**Output**

|Count|
|-----|
|8|
