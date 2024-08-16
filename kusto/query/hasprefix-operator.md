---
title:  The case-insensitive hasprefix string operator
description: Learn how to use the hasprefix operator to filter data with a case-insensitive string.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# hasprefix operator

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Filters a record set for data with a case-insensitive starting string.

For best performance, use strings of three characters or more. `hasprefix` searches for indexed terms, where a [term](datatypes-string-operators.md#what-is-a-term) is three or more characters. If your term is fewer than three characters, the query scans the values in the column, which is slower than looking up the term in the term index.

[!INCLUDE [has-prefix-operator-comparison](../includes/hasprefix-operator-comparison.md)]

## Performance tips

[!INCLUDE [performance-tip-note](../includes/performance-tip-note.md)]

When possible, use the case-sensitive [hasprefix_cs](hasprefix-cs-operator.md).

## Syntax

*T* `|` `where` *Column* `hasprefix` `(`*Expression*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T* | `string` |  :heavy_check_mark: | The tabular input whose records are to be filtered.|
| *Column* | `string` |  :heavy_check_mark: | The column used to filter.|
| *Expression* | `string` |  :heavy_check_mark: | The expression for which to search.|

## Returns

Rows in *T* for which the predicate is `true`.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKC7NzU0syqxKVUgFCcUn55fmldiCSQ1NhaRKheCSxJJUoMLyjNSiVAhPISOxuKAoNS2zQkEpJ1EJKFlQlJ+VmlwCkdZBNgoAsFHbIG4AAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| summarize event_count=count() by State
| where State hasprefix "la"
| project State, event_count
```

|State|event_count|
|-----|-----------|
|LAKE MICHIGAN|182|
|LAKE HURON|63|
|LAKE SUPERIOR|34|
|LAKE ST CLAIR|32|
|LAKE ERIE|27|
|LAKE ONTARIO|8|
