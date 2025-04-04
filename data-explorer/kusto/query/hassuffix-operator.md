---
title:  The case-insensitive hassuffix string operator
description:  Learn how to use the hassuffix operator to filter data with a case-insensitive suffix string.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# hassuffix operator

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Filters a record set for data with a case-insensitive ending string. `hassuffix` returns `true` if there is a [term](datatypes-string-operators.md#what-is-a-term) inside the filtered string column ending with the specified string expression.

[!INCLUDE [hassuffix-operator-comparison](../includes/hassuffix-operator-comparison.md)]

## Performance tips

[!INCLUDE [performance-tip-note](../includes/performance-tip-note.md)]

When possible, use the case-sensitive [hassuffix_cs](hassuffix-cs-operator.md).

> [!NOTE]
> Text index cannot be fully utilized for this function, therefore the performance of this function is comparable to [endswith](endswith-operator.md) function, though the semantics is different.

## Syntax

*T* `|` `where` *Column* `hassuffix` `(`*Expression*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*T*| `string` |The tabular input whose records are to be filtered.|
|*Column*| `string` |The column by which to filter.|
|*Expression*|scalar|The scalar or literal expression for which to search.|

## Returns

Rows in *T* for which the predicate is `true`.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKC7NzU0syqxKVUgFCcUn55fmldiCSQ1NhaRKheCSxJJUoMLyjNSiVAhPISOxuLg0LS2zQkGpJEMJKFlQlJ+VmlwCkdZBNgoApSHU8m4AAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| summarize event_count=count() by State
| where State hassuffix "th"
| project State, event_count
```

**Output**

|State|event_count|
|-----|-----------|
|NORTH CAROLINA|1721|
|SOUTH DAKOTA|1567|
|SOUTH CAROLINA|915|
|NORTH DAKOTA|905|
|ATLANTIC SOUTH|193|
|ATLANTIC NORTH|188|
