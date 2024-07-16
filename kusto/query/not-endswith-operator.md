---
title:  The case-insensitive !endswith string operator
description: Learn how to use the !endswith string operator to filter records for data that excludes a case-insensitive ending string.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/10/2023
---
# !endswith operator

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Filters a record set for data that excludes a case-insensitive ending string.

[!INCLUDE [endswith-operator-comparison](../includes/endswith-operator-comparison.md)]

## Performance tips

[!INCLUDE [performance-tip-note](../includes/performance-tip-note.md)]

When possible, use the case-sensitive [!endswith_cs](not-endswith-cs-operator.md).

## Syntax

*T* `|` `where` *col* `!endswith` `(`*expression*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T* | `string` |  :heavy_check_mark:| The tabular input whose records are to be filtered. |
| *col* | `string` |  :heavy_check_mark: | The column to filter. |
| *expression* | `string` |  :heavy_check_mark: | The expression used to filter. |

## Returns

Rows in *T* for which the predicate is `true`.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKC7NzU0syqxKVYAI2Sbnl+aVaGgqJFUqBJcklqQC1ZRnpBalQngKiql5KcXlmSUZCkqZxUpwSYhmBTsFIwMDA6BoQVF+VmpyCUSTDlQaADTefzN6AAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| summarize Events=count() by State
| where State !endswith "is"
| where Events > 2000
| project State, Events
```

**Output**

|State|Events|
|--|--|
|TEXAS|4701|
|KANSAS|3166|
|IOWA|2337|
|MISSOURI|2016|
