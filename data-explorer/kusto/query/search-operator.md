---
title:  search operator
description: Learn how to use the search operator to search for a text pattern in multiple tables and columns.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/21/2025
---
# search operator

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Searches a text pattern in multiple tables and columns.

> [!NOTE]
> If you know the specific tables and columns you want to search, it's more performant to use the [union](union-operator.md) and [where](where-operator.md) operators. The `search` operator can be slow when searching across a large number of tables and columns.

## Syntax

[*T* `|`] `search` [`kind=` *CaseSensitivity* ] [`in` `(`*TableSources*`)`] *SearchPredicate*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T* | `string` | | The tabular data source to be searched over, such as a table name, a [union operator](union-operator.md), or the results of a tabular query. Can't appear together with *TableSources*.|
| *CaseSensitivity* | `string` | | A flag that controls the behavior of all `string` scalar operators, such as `has`, with respect to case sensitivity. Valid values are `default`, `case_insensitive`, `case_sensitive`. The options `default` and `case_insensitive` are synonymous, since the default behavior is case insensitive.|
| *TableSources* | `string` | | A comma-separated list of "wildcarded" table names to take part in the search. The list has the same syntax as the list of the [union operator](union-operator.md). Can't appear together with *TabularSource*.|
| *SearchPredicate* | `string` |  :heavy_check_mark: | A boolean expression to be evaluated for every record in the input. If it returns `true`, the record is outputted. See [Search predicate syntax](#search-predicate-syntax).|

### Search predicate syntax

The *SearchPredicate* allows you to search for specific terms in all columns of a table. The operator that is applied to a search term depends on the presence and placement of a wildcard asterisk (`*`) in the term, as shown in the following table.

|Literal   |Operator   |
|----------|-----------|
|`billg`   |`has`      |
|`*billg`  |`hassuffix`|
|`billg*`  |`hasprefix`|
|`*billg*` |`contains` |
|`bi*lg`   |`matches regex`|

You can also restrict the search to a specific column, look for an exact match instead of a term match, or search by regular expression. The syntax for each of these cases is shown in the following table.

|Syntax|Explanation|
|--|--|
|*ColumnName*`:`*StringLiteral* | This syntax can be used to restrict the search to a specific column. The default behavior is to search all columns. |
|*ColumnName*`==`*StringLiteral* | This syntax can be used to search for exact matches of a column against a string value. The default behavior is to look for a term-match.|
| *Column* `matches regex` *StringLiteral* | This syntax indicates regular expression matching, in which *StringLiteral* is the regex pattern.|

Use boolean expressions to combine conditions and create more complex searches. For example, `"error" and x==123` would result in a search for records that have the term `error` in any columns and the value `123` in the `x` column.

> [!NOTE]
> If both *TabularSource* and *TableSources* are omitted, the search is carried over all unrestricted tables and views of the database in scope.

### Search predicate syntax examples

  |# |Syntax                                 |Meaning (equivalent `where`)           |Comments|
  |--|---------------------------------------|---------------------------------------|--------|
  | 1|`search "err"`                         |`where * has "err"`                    ||
  | 2|`search in (T1,T2,A*) "err"`           |<code>union T1,T2,A* &#124; where * has "err"<code>   ||
  | 3|`search col:"err"`                     |`where col has "err"`                  ||
  | 4|`search col=="err"`                    |`where col=="err"`                     ||
  | 5|`search "err*"`                        |`where * hasprefix "err"`              ||
  | 6|`search "*err"`                        |`where * hassuffix "err"`              ||
  | 7|`search "*err*"`                       |`where * contains "err"`               ||
  | 8|`search "Lab*PC"`                      |`where * matches regex @"\bLab.*PC\b"`||
  | 9|`search *`                             |`where 0==0`                           ||
  |10|`search col matches regex "..."`       |`where col matches regex "..."`        ||
  |11|`search kind=case_sensitive`           |                                       |All string comparisons are case-sensitive|
  |12|`search "abc" and ("def" or "hij")`    |`where * has "abc" and (* has "def" or * has hij")`||
  |13|`search "err" or (A>a and A<b)`        |`where * has "err" or (A>a and A<b)`   ||

## Remarks

Unlike the [find operator](find-operator.md), the `search` operator doesn't support the following syntax:

1. `withsource=`: The output always includes a column called `$table` of type `string` whose value
   is the table name from which each record was retrieved (or some system-generated name if the source
   isn't a table but a composite expression).
2. `project=`, `project-smart`: The output schema is equivalent to `project-smart` output schema.

## Examples

The example in this section shows how to use the syntax to help you get started.
	
[!INCLUDE [help-cluster](../includes/help-cluster-note.md)]

### Global term search

Search for the term Green in all the tables of the *ContosoSales* database.

The output finds records with the term *Green* as a last name or a color in the `Customers`, `Products`, and `SalesTable` tables. 

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/ContosoSales?query=H4sIAAAAAAAAAytOTSxKzlBQci9KTc1TAgAhG1rADgAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
 search "Green"
```

**Output**

| $table | CityName | ContinentName | CustomerKey | Education | FirstName | Gender | LastName |
|--|--|--|--|--|--|--|--|
| Customers | Ballard | North America | 16549 | Partial College | Mason | M | Green |
| Customers | Bellingham | North America | 2070 | High School | Adam | M | Green |
| Customers | Bellingham | North America | 10658 | Bachelors | Sara | F | Green |
| Customers | Beverly Hills | North America | 806 | Graduate Degree | Richard | M | Green |
| Customers | Beverly Hills | North America | 7674 | Graduate Degree | James | M | Green |
| Customers | Burbank | North America | 5241 | Graduate Degree | Madeline | F | Green |

### Conditional global term search

Search for records that contain the term *Green* and one of either terms *Deluze* or *Proseware* in the *ContosoSales* database.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/ContosoSales?query=H4sIAAAAAAAAAytOTSxKzlBQci9KTc1TUkjMS1HQUHJJzSmtSFVSyC9SUAooyi9OLU8sSlXSBADUfdV9LAAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
search "Green" and ("Deluxe" or "Proseware")
```

**Output**

| $table | ProductName | Manufacturer | ColorName | ClassName | ProductCategoryName |
|--|--|--|--|--|--|
| Products | Contoso 8GB Clock & Radio MP3 Player X850 Green | Contoso, Ltd | Green | Deluxe | Audio |
| Products | Proseware Scan Jet Digital Flat Bed Scanner M300 Green | Proseware, Inc. | Green | Regular | Computers |
| Products | Proseware All-In-One Photo Printer M200 Green | Proseware, Inc. | Green | Regular | Computers |
| Products | Proseware Ink Jet Wireless All-In-One Printer M400 Green | Proseware, Inc. | Green | Regular | Computers |
| Products | Proseware Ink Jet Instant PDF Sheet-Fed Scanner M300 Green | Proseware, Inc. | Green | Regular | Computers |
| Products | Proseware Desk Jet All-in-One Printer, Scanner, Copier M350 Green | Proseware, Inc. | Green | Regular | Computers |
| Products | Proseware Duplex Scanner M200 Green | Proseware, Inc. | Green | Regular | Computers |

### Search a specific table

Search for the term *Green* only in the `Customers` table.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/ContosoSales?query=H4sIAAAAAAAAAytOTSxKzlDIzFPQCCjKTylNLinWVFByL0pNzVMCAAJBkngcAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
search in (Products) "Green"
```

**Output**

| $table | ProductName | Manufacturer | ColorName |
|--|--|--|--|
| Products | Contoso 4G MP3 Player E400 Green | Contoso, Ltd | Green |
| Products | Contoso 8GB Super-Slim MP3/Video Player M800 Green | Contoso, Ltd | Green |
| Products | Contoso 16GB Mp5 Player M1600 Green | Contoso, Ltd | Green |
| Products | Contoso 8GB Clock & Radio MP3 Player X850 Green | Contoso, Ltd | Green |
| Products | NT Wireless Bluetooth Stereo Headphones M402 Green | Northwind Traders | Green |
| Products | NT Wireless Transmitter and Bluetooth Headphones M150 Green | Northwind Traders | Green |

### Case-sensitive search

Search for records that match the case-sensitive term in the *ContosoSales* database.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/ContosoSales?query=H4sIAAAAAAAAAytOTSxKzlDIzsxLsU1OLE6NL07NK84sySxLVVBKyilNVQIAA9DDEiEAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
search kind=case_sensitive "blue"
```

**Output**

| $table | ProductName | Manufacturer | ColorName | ClassName |
|--|--|--|--|--|
| Products | Contoso 16GB New Generation MP5 Player M1650 blue | Contoso, Ltd | blue | Regular |
| Products | Contoso Bright Light battery E20 blue | Contoso, Ltd | blue | Economy |
| Products | Litware 120mm Blue LED Case Fan E901 blue | Litware, Inc. | blue | Economy |
| NewSales | Litware 120mm Blue LED Case Fan E901 blue | Litware, Inc. | blue | Economy |
| NewSales | Litware 120mm Blue LED Case Fan E901 blue | Litware, Inc. | blue | Economy |
| NewSales | Litware 120mm Blue LED Case Fan E901 blue | Litware, Inc. | blue | Economy |
| NewSales | Litware 120mm Blue LED Case Fan E901 blue | Litware, Inc. | blue | Economy |

### Search specific columns

Search for the terms  *Aaron* and *Hughes*, in the "FirstName" and "LastName" columns respectively, in the *ContosoSales* database.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/ContosoSales?query=H4sIAAAAAAAAAytOTSxKzlBwyywqLvFLzE21UnJMLMrPU1LIL1LwSYSJeZSmZ6QWKwEA/CSSXi0AAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
search FirstName:"Aaron" or LastName:"Hughes"
```

**Output**

| $table | CustomerKey | Education | FirstName | Gender | LastName |
|--|--|--|--|--|--|
| Customers | 18285 | High School | Riley | F | Hughes |
| Customers | 802 | Graduate Degree | Aaron | M | Sharma |
| Customers | 986 | Bachelors | Melanie | F | Hughes |
| Customers | 12669 | High School | Jessica | F | Hughes |
| Customers | 13436 | Graduate Degree | Mariah | F | Hughes |
| Customers | 10152 | Graduate Degree | Aaron | M | Campbell |

### Limit search by timestamp

Search for the term *Hughes* in the *ContosoSales* database, if the term appears in a record with a date greater than the given date in 'datetime'.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/ContosoSales?query=H4sIAAAAAAAAAytOTSxKzlBQ8ihNz0gtVlJIzEtRcEksSfVOrVSwU0gBskoyc1M11I0MDCx1DQyBSF0TAMIgQA00AAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
search "Hughes" and DateKey > datetime('2009-01-01')
```

**Output**

| $table | DateKey | SalesAmount_real |
|--|--|--|
| SalesTable | 2021-12-13T00:00:00Z | 446.4715 |
| SalesTable | 2021-12-13T00:00:00Z | 120.555 |
| SalesTable | 2021-12-13T00:00:00Z | 48.4405 |
| SalesTable | 2021-12-13T00:00:00Z | 39.6435 |
| SalesTable | 2021-12-13T00:00:00Z | 56.9905 |

## Performance Tips

|#|Tip|Prefer|Over|
|--|--|--|--|
| 1| Prefer to use a single `search` operator over several consecutive `search` operators|`search "billg" and ("steveb" or "satyan")` |<code>search "billg" &#124; search "steveb" or "satyan"<code>|
| 2| Prefer to filter inside the `search` operator |`search "billg" and "steveb"` |<code>search * &#124; where * has "billg" and * has "steveb"<code> |
