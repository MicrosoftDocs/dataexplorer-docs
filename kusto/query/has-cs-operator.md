---
title:  The case-sensitive has_cs string operator
description: Learn how to use the has_cs operator to filter data with a case-sensitive search string.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# has_cs operator

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Filters a record set for data with a case-sensitive search string. `has_cs` searches for indexed terms, where an indexed [term](datatypes-string-operators.md#what-is-a-term) is three or more characters. If your term is fewer than three characters, the query scans the values in the column, which is slower than looking up the term in the term index.

[!INCLUDE [has-operator-comparison](../includes/has-operator-comparison.md)]

## Performance tips

[!INCLUDE [performance-tip-note](../includes/performance-tip-note.md)]

## Syntax

*T* `|` `where` *Column* `has_cs` `(`*Expression*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T* | `string` |  :heavy_check_mark: | The tabular input whose records are to be filtered.|
| *Column* | `string` |  :heavy_check_mark: | The column used to filter the records.|
| *Expression* | scalar or tabular |  :heavy_check_mark: | An expression for which to search. If the value is a tabular expression and has multiple columns, the first column is used.|

## Returns

Rows in *T* for which the predicate is `true`.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKC7NzU0syqxKVUgFCcUn55fmldiCSQ1NhaRKheCSxJJUoMLyjNSiVAhPISOxOD65WEHJzcc/yNPFUQkAo0dX71MAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| summarize event_count=count() by State
| where State has_cs "FLORIDA"
```

**Output**

|State|event_count|
|--|--|
|FLORIDA|1042|

Since all `State` values are capitalized, searching for a lowercase string with the same value, such as "florida", won't yield any results.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuDlqlEoz0gtSlUILkksSVXISCyOT8yrVNBQcnYM8vfx9HNU0lFQcnH09g8Bs/xcw5U0wbqKS3NzE4syq1IVkvNL80o0NBWSKiGGAACHltT/YAAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| summarize event_count=count() by State
| where State has_cs "florida"
```

**Output**

|State|event_count|
|--|--|
|||
