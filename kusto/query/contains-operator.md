---
title:  The case-insensitive contains string operator
description: Learn how to use the contains operator to filter a record set for data containing a case-insensitive string.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# contains operator

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Filters a record set for data containing a case-insensitive string. `contains` searches for arbitrary sub-strings rather than [terms](datatypes-string-operators.md#what-is-a-term).

[!INCLUDE [contains-operator-comparison](../includes/contains-operator-comparison.md)]

## Performance tips

[!INCLUDE [performance-tip-note](../includes/performance-tip-note.md)]

When possible, use [contains_cs](contains-cs-operator.md) - a case-sensitive version of the operator.

If you're looking for a [term](datatypes-string-operators.md#what-is-a-term), use `has` for faster results.

## Syntax

*T* `|` `where` *col* `contains_cs` `(`*string*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T* | `string` |  :heavy_check_mark: | The tabular input whose records are to be filtered. |
| *col* | `string` |  :heavy_check_mark: | The name of the column to check for *string*. |
| *string* | `string` |  :heavy_check_mark: | The case-sensitive string by which to filter the data. |

## Returns

Rows in *T* for which *string* is in *col*.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKC7NzU0syqxKVUgFCcUn55fmldiCSQ1NhaRKheCSxJJUoMLyjNSiVAhPITk/ryQxM69YQSk1L08JLolkgoKdgqEBUKKgKD8rNbkEok8HWQVQsig1LyW1SKEkMSknFQCgPhGflgAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| summarize event_count=count() by State
| where State contains "enn"
| where event_count > 10
| project State, event_count
| render table
```

**Output**

|State|event_count|
|-----|-----------|
|PENNSYLVANIA|1687|
|TENNESSEE|1125|
