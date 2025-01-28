---
title:  project-reorder operator
description: Learn how to use the project-reorder operator to reorder columns in the output table.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# project-reorder operator

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Reorders columns in the output table.

## Syntax

*T* `| project-reorder` *ColumnNameOrPattern* [`asc` | `desc` | `granny-asc` | `granny-desc`] [`,` ...]

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T* | `string` |  :heavy_check_mark: | The input tabular data.|
| *ColumnNameOrPattern* | `string` |  :heavy_check_mark: | The name of the column or column wildcard pattern by which to order the columns. |
| `asc`, `desc`, `granny-asc`, `granny-desc` | `string` | | Indicates how to order the columns when a wildcard pattern is used. `asc` or `desc` orders columns by column name in ascending or descending manner, respectively. `granny-asc` or `granny-desc` orders by ascending or descending, respectively, while secondarily sorting by the next numeric value. For example, `a100` comes before `a20` when `granny-asc` is specified.|

> [!NOTE]
>
> * If no explicit ordering is specified, the order is determined by the matching columns as they appear in the source table.
> * In ambiguous *ColumnNameOrPattern* matching, the column appears in the first position matching the pattern.
> * Specifying columns for the `project-reorder` is optional. Columns that aren't specified explicitly appear as the last columns of the output table.
> * To remove columns, use [`project-away`](project-away-operator.md).
> * To choose which columns to keep, use [`project-keep`](project-keep-operator.md).
> * To rename columns, use [`project-rename`](project-rename-operator.md).

## Returns

A table that contains columns in the order specified by the operator arguments. `project-reorder` doesn't rename or remove columns from the table, therefore, all columns that existed in the source table, appear in the result table.

## Examples

[!INCLUDE [help-cluster](../includes/help-cluster-note.md)]

Review the examples and run them in your Data Explorer query page.

### Reorder with b first

Reorder a table with three columns (a, b, c) so the second column (b) will appear first.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUi0VU9U11FIslVPAlLJturJ6rxcNQoKBUX5WanJJbpFqflFKalFCkkA1H2l7S8AAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print a='a', b='b', c='c'
|  project-reorder b
```

**Output**

| b | a | c |
|--|--|--|
| b | a | c |

### Reorder with a first

Reorder columns of a table so that columns starting with `a` will appear before other columns.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUhSsFVQT1LXUUg0slVPNAIxjIEMYxDDEMgwVOflqlFQKCjKz0pNLtEtSs0vSkktUkjUUkgsTgYAJU2yOEMAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print b = 'b', a2='a2', a3='a3', a1='a1'
|  project-reorder a* asc
```

**Output**

| a1 | a2 | a3 | b |
|--|--|--|--|
| a1 | a2 | a3 | b |
