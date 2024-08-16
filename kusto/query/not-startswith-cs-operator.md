---
title:  The case-sensitive !startswith_cs string operator
description: Learn how to use the !startswith_cs string operator to filter records for data that doesn't start with a case-sensitive search string.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# !startswith_cs operators

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Filters a record set for data that doesn't start with a case-sensitive search string.

[!INCLUDE [startswith-operator-comparison](../includes/startswith-operator-comparison.md)]

## Performance tips

[!INCLUDE [performance-tip-note](../includes/performance-tip-note.md)]

## Syntax

*T* `|` `where` *column* `!startswith_cs` `(`*expression*`)`  

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T* | `string` |  :heavy_check_mark:| The tabular input whose records are to be filtered.|
| *column* | `string` |  :heavy_check_mark:| The column by which to filter.|
| *expression* | scalar |  :heavy_check_mark:| The scalar or literal expression for which to search.|

## Returns

Rows in *T* for which the predicate is `true`.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKC7NzU0syqxKVUgFCcUn55fmldiCSQ1NhaRKheCSxJJUoMLyjNSiVAhPQbG4JLGopLg8syQjPrlYQclTCa4AyRQFOwUjAwMDoFRBUX5WanIJRLcOshoAsNzTI40AAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| summarize event_count=count() by State
| where State !startswith_cs "I"
| where event_count > 2000
| project State, event_count
```

**Output**

|State|event_count|
|-----|-----------|
|TEXAS|4701|
|KANSAS|3166|
|MISSOURI|2016|
