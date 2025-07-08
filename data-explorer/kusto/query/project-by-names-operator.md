---
title:  project-by-names operator
description: Learn how to use the project-by-names operator to select a subset of columns from the input table by their names, dynamic arrays, or name patterns.
ms.reviewer: alexans
ms.author: v-hzargari
ms.topic: reference
ms.date: 07/07/2025
monikerRange: "microsoft-fabric || azure-data-explorer || azure-monitor || microsoft-sentinel "
---

# project-by-names operator

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Select and reorder a subset of columns from the input table by their names, dynamic arrays, or name patterns.

## Syntax

*T* `| project-by-names` *ColumnSpecifier* [`,` ...]

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T* | `string` |  :heavy_check_mark: | The tabular input from which to remove columns. |
| *ColumnSpecifier* | `string` |  :heavy_check_mark: | The name of the column, dynamic array of column names, or column wildcard pattern to keep and reorder.|

> [!NOTE]
> * Columns in the result are ordered based on the sequence in which they are specified or matched.
> * Column names that don't match any existing column are safely ignored.
> * Wildcard characters (e.g., *) can be used to match multiple columns by name pattern.
> * ColumnSpecifier can include the result of a column_names_of(Table) expression, which returns a dynamic array of column names from the specified table.
> * Subqueries or scalar expressions like toscalar() are not supported in the *ColumnSpecifier* parameter.
> * For related functionality:
>   * Use [`project-away`](project-away-operator.md) to exclude specific columns from the result.
>   * Use [`project-keep`](project-keep-operator.md) to retain columns without changing their order.
>   * Use [`project-rename`](project-rename-operator.md) to rename columns.

## Returns

A table containing only the columns specified in the *ColumnSpecifier* parameter, in the specified order. All unspecified columns are excluded from the result.

## Examples

The examples below demonstrate how to use the `project-by-names` operator to select and reorder columns from a table.
The input table has 4 columns: `Name`, `Age`, `City`, and `Country`.

### Keep and reorder specific columns

 Use the operator to keep only the `Name` and `City` columns.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/kvc-h7uuxuqwzng0t6ps3t.northeurope/databases/MyDatabase?query=H4sIAAAAAAAAA0tJLAHCpJxUDb%2FE3FSr4pKizLx0HQXH9FSrzLwSHQXnzJJKuKhzfmleSRGMr6nAyxWtHpBaklqkrqNgbKmjoO6XWq4QmV%2BUDeSrhwY7qsfyctUoFBTlZ6Uml%2BgmVermAe0oVlACWaWko6AEMlwJACQetbmCAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable(Name:string, Age:int, City:string, Country:string) 
['Peter', 39, 'New York', 'USA']
| project-by-names "Name", "City"
```

**Output**

| Name  | City      |
|--|--|
| Peter | New York |

### Keep columns using a dynamic array

Use the operator to select columns from the input table by providing a dynamic array of column names.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/kvc-h7uuxuqwzng0t6ps3t.northeurope/databases/MyDatabase?query=H4sIAAAAAAAAA0tJLAHCpJxUDb%2FE3FSr4pKizLx0HQXH9FSrzLwSHQXnzJJKuKhzfmleSRGMr6nAyxWtHpBaklqkrqNgbKmjoO6XWq4QmV%2BUDeSrhwY7qsfyctUoFBTlZ6Uml%2BgmVermAe0oVkipBNKZyRrRSiA7lXQUlKAGK8VqAgCw9IHdkAAAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable(Name:string, Age:int, City:string, Country:string) 
['Peter', 39, 'New York', 'USA']
| project-by-names dynamic(["Name", "Country"])
```

**Output**

| Name  | Country |
|--|--|
| Peter | USA |

### Keep columns using column name patterns

Use the operator to select columns from the input table starting with `C`.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/kvc-h7uuxuqwzng0t6ps3t.northeurope/databases/MyDatabase?query=H4sIAAAAAAAAA0tJLAHCpJxUDb%2FE3FSr4pKizLx0HQXH9FSrzLwSHQXnzJJKuKhzfmleSRGMr6nAyxWtHpBaklqkrqNgbKmjoO6XWq4QmV%2BUDeSrhwY7qsfyctUoFBTlZ6Uml%2BgmVermAe0oVlBy1lICACmv9HJ4AAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable(Name:string, Age:int, City:string, Country:string) 
['Peter', 39, 'New York', 'USA']
| project-by-names "C*"
```

**Output**

| City      | Country |
|--|--|
| New York | USA |

### Lookup and keeping lookup columns using a dynamic array

Use the operator to keep columns from a table after performing a lookup, specifying which columns to retain using a dynamic array.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/kvc-h7uuxuqwzng0t6ps3t.northeurope/databases/MyDatabase?query=H4sIAAAAAAAAA3VQQWrDMBC8G%2FyHva0F8qmnOvQQ3GMJhbSHEoxxnE1QLWuDLLeYpn%2BvEilJQ6l0mmF2Znc0OXhi7sb9S7PWBA%2BQJuDfpnH%2BeyZbND0Vg7PK7CTMd1Qo4ySUyk0XtuTROHvGIjis8JkcWZRwdy8BF%2FQJb2w7j%2FF1Ocdq5pP0Jb1kPfZm8PnZkkfbUvE7WEjQJ1ndBl0Bm8k0vWoFfMWNw1gEh6i%2FuY0NHD3Pir3ld2pdvp5yb0UDBO%2F6BGrexkX%2BZKfJ9yxN%2Fino0ZPXHq4dYDDLj2NYpckBlPngjm7Pz%2BJV2Qpjp1gJ8QM04axgpAEAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
let LookupTable = 
    datatable(Name:string, Age:int, City:string, Country:string)
    ['Peter', 39, 'New York', 'USA']; 
let LookupColumns = (Source:(Name:string), lookup_columns: dynamic) { 
    Source 
    | lookup LookupTable on Name
    | project-by-names column_names_of(Source), lookup_columns
};
datatable(Name:string, Data:string)
['Peter', 'Source-data']
| invoke LookupColumns(dynamic(['Country']))
```

**Output**

| Name  | Data | Country |
|--|--|--|
| Peter | Source-data | USA |

### Ignore non-existing columns

Same as above, but with a non-existent column in the dynamic array.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/kvc-h7uuxuqwzng0t6ps3t.northeurope/databases/MyDatabase?query=H4sIAAAAAAAAA3VQQWrDMBC8G%2FyHvckC%2BZRTHXoIbm%2FBFNIeSjDGcbZBtawNstzWNP175UhJGkKl0wyzM7uj0MKSqB32z%2FVGIdxDHIF729q675ikqDvMemuk3glY7DCT2grIpR3PbE6DtuaEuXdYsye0aJiA2Z0AVuAnvJJpHWYvqwUr5y5JndNzUkOne5efrGgwDWZ%2Fg7kAdZRVjddlsB113cmGw3fY2I8FcAj6q9tIw%2BR5UuwNvWNj082YOivswXtXR1DRW1jkJjuOfuZx9E9BD4689HDpgHmzdBpjZRwdQOoPavH6%2FCRclaxZ6HQaLUg%2Ffsneoras5PwXDXk%2FVLMBAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
let LookupTable = 
    datatable(Name:string, Age:int, City:string, Country:string)
    ['Peter', 39, 'New York', 'USA']; 
let LookupColumns = (Source:(Name:string), lookup_columns: dynamic) { 
    Source 
    | lookup LookupTable on Name
    | project-by-names column_names_of(Source), lookup_columns
};
datatable(Name:string, Data:string)
['Peter', 'Source-data']
| invoke LookupColumns(dynamic(['Country', 'NonExistent']))
```

**Output**

| Name  | Data | Country |
|--|--|--|
| Peter | Source-data | USA |

## Related content

* [`project-away operator`](project-away-operator.md)
* [`project-keep operator`](project-keep-operator.md)
* [`project-rename operator`](project-rename-operator.md)