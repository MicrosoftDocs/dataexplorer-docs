---
title:  The case-sensitive startswith string operator
description: Learn how to use the startswith string operator to filter a record set with a case-sensitive string starting sequence.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# startswith_cs operator

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Filters a record set for data with a case-sensitive string starting sequence.

[!INCLUDE [startswith-operator-comparison](../includes/startswith-operator-comparison.md)]

## Performance tips

[!INCLUDE [performance-tip-note](../includes/performance-tip-note.md)]

## Syntax

*T* `|` `where` *col* `startswith_cs` `(`*expression*`)`  

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T* | `string` |  :heavy_check_mark: | The tabular input to filter.|
| *col* | `string` |  :heavy_check_mark: | The column used to filter.|
| *expression* | `string` |  :heavy_check_mark: | The expression by which to filter.|

## Returns

Rows in *T* for which the predicate is `true`.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKC7NzU0syqxKVUgFCcUn55fmldiCSQ1NhaRKheCSxJJUoMLyjNSiVAhPobgksaikuDyzJCM+uVhByVMJLo9kiIKdgpGBgQFQqqAoPys1uQSiWQdZDQCj4hmWjAAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| summarize event_count=count() by State
| where State startswith_cs "I"
| where event_count > 2000
| project State, event_count
```

**Output**

|State|event_count|
|-----|-----------|
|IOWA|2337|
|ILLINOIS|2022|
