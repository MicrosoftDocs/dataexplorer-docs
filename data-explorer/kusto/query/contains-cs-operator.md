---
title: The case-sensitive contains_cs string operator - Azure Data Explorer
description: Learn how to use the contains_cs operator to filter a record set for data containing a case-sensitive string.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/11/2023
---
# contains_cs operator

Filters a record set for data containing a case-sensitive string. `contains` searches for characters rather than [terms](datatypes-string-operators.md#what-is-a-term) of three or more characters. The query scans the values in the column, which is slower than looking up a term in a term index.

[!INCLUDE [contains-operator-comparison](../../includes/contains-operator-comparison.md)]

## Performance tips

[!INCLUDE [performance-tip-note](../../includes/performance-tip-note.md)]

For faster results, use the case-sensitive version of an operator. For example, use `contains_cs` instead of `contains`.

If you're testing for the presence of a symbol or alphanumeric word that is bound by non-alphanumeric characters at the start or end of a field, for faster results use `has` or `in`. Also, `has` works faster than `contains`, `startswith`, or `endswith`, however it isn't as precise and could provide unwanted records.

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
