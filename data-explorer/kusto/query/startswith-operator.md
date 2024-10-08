---
title:  The case-insensitive startswith string operator
description: Learn how to use the case-insensitive startswith string operator to filter a record set with a case-insensitive string starting sequence.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# startswith operator

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Filters a record set for data with a case-insensitive string starting sequence.

[!INCLUDE [startswith-operator-comparison](../includes/startswith-operator-comparison.md)]

## Performance tips

[!INCLUDE [performance-tip-note](../includes/performance-tip-note.md)]

When possible, use the case-sensitive [startswith_cs](startswith-cs-operator.md).

## Syntax

*T* `|` `where` *col* `startswith` `(`*expression*`)`

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
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKC7NzU0syqxKVUgFCcUn55fmldiCSQ1NhaRKheCSxJJUoMLyjNSiVAhPobgksaikuDyzJENBySdfCS6LZISCnYKhAVCioCg/KzW5BKJRB1kFAIySNF2IAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| summarize event_count=count() by State
| where State startswith "Lo"
| where event_count > 10
| project State, event_count
```

**Output**

|State|event_count|
|-----|-----------|
|LOUISIANA|463|  
