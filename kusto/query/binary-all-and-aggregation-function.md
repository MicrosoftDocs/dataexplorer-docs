---
title:  binary_all_and() (aggregation function)
description: Learn how to use the binary_all_and() function to aggregate values using the binary AND operation.
ms.topic: reference
ms.date: 08/11/2024
---
# binary_all_and() (aggregation function)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Accumulates values using the binary `AND` operation for each summarization group, or in total if a group is not specified.

[!INCLUDE [data-explorer-agg-function-summarize-note](../includes/agg-function-summarize-note.md)]

## Syntax

`binary_all_and` `(`*expr*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *expr* | `long` |  :heavy_check_mark: | The value used for the binary `AND`  calculation. |

## Returns

Returns an aggregated value using the binary `AND` operation over records for each summarization group, or in total if a group is not specified.

## Example

The following example produces `CAFEF00D` using binary `AND` operations:

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0tJLAHCpJxUjbzSXKuc/Lx0Ta5oLgUFgwo3KNBRQHANDNx0wDxniJwLhOfm6OYKVsoVy1WjUFyam5tYlFmVqlCUWlyaU6Jgq1CSX1pQkFqkUZKfkVqhkZSZl1hUGZ+YkxOfmJcCslhTUxMAwZHTS4kAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable(num:long)
[
  0xFFFFFFFF, 
  0xFFFFF00F,
  0xCFFFFFFD,
  0xFAFEFFFF,
]
| summarize result = toupper(tohex(binary_all_and(num)))
```

**Output**

|result|
|---|
|CAFEF00D|
