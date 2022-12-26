---
title: The case-insensitive hasprefix string operator - Azure Data Explorer
description: This article describes the case-insensitive hasprefix string operator in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 12/25/2022
---
# hasprefix operator

Filters a record set for data with a case-insensitive starting string.

For best performance, use strings of three characters or more. `has` searches for indexed terms, where a [term](datatypes-string-operators.md#what-is-a-term) is three or more characters. If your term is fewer than three characters, the query scans the values in the column, which is slower than looking up the term in the term index.

[!INCLUDE [has-prefix-operator-comparison](../../includes/has-prefix-operator-comparison.md)]

## Performance tips

> [!NOTE]
> Performance depends on the type of search and the structure of the data.

For faster results, use the case-sensitive version of an operator, for example, `hasprefix_cs`, not `hasprefix`. For best practices, see [Query best practices](best-practices.md).

## Syntax

*T* `|` `where` *Column* `hasprefix` `(`*Expression*`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T* | string | &check; | The tabular input whose records are to be filtered.|
| *Column* | string | &check; | The column used to filter.|
| *Expression* | string | &check; | The expression for which to search.|

## Returns

Rows in *T* for which the predicate is `true`.

## Example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKC7NzU0syqxKVUgFCcUn55fmldiCSQ1NhaRKheCSxJJUoMLyjNSiVAhPISOxuKAoNS2zQkEpJ1EJKFlQlJ+VmlwCkdZBNgoAsFHbIG4AAAA=" target="_blank">Run the query</a>

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
