---
title:  project-rename operator
description: Learn how to use the project-rename operator to rename columns in the output table.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/16/2023
---
# project-rename operator

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Renames columns in the output table.

## Syntax

*T* `| project-rename` *NewColumnName* = *ExistingColumnName* [`,` ...]

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T* | `string` |  :heavy_check_mark: | The input tabular data.|
| *NewColumnName* | `string` |  :heavy_check_mark: | The new column name.|
| *ExistingColumnName* | `string` |  :heavy_check_mark: | The name of the existing column to rename.|

## Returns

A table that has the columns in the same order as in an existing table, with columns renamed.

## Examples

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUi0VU9U11FIslVPAlLJturJ6rxcNQoFRflZqcklukWpeYm5qQp5qeXxSbZJOmBGom0iALIWMhk8AAAA" target="_blank">Run the query</a>
:::moniker-end

```kusto
print a='a', b='b', c='c'
|  project-rename new_b=b, new_a=a
```

**Output**

|new_a|new_b|c|
|---|---|---|
|a|b|c|
