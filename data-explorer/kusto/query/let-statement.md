---
title:  Let statement
description: Learn how to use the Let statement to set a variable name to define an expression or a function.
ms.reviewer: alexans
ms.topic: reference
ms.date: 07/20/2025
ms.localizationpriority: high
---
# Let statement

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

A `let` statement is used to set a variable name equal to an expression or a function, or to create [views](schema-entities/views.md).

`let` statements are useful for:

* Breaking up a complex expression into multiple parts, each represented by a variable.
* Defining constants outside of the query body for readability.
* Defining a variable once and using it multiple times within a query.

If the variable previously represented another value, for example in nested statements, the innermost `let` statement applies.

To optimize multiple uses of the `let` statement within a single query, see [Optimize queries that use named expressions](named-expressions.md).

> [!NOTE]
> The `let` statement binds a name to a calculation, not to the evaluated value of that calculation. This behavior means that multiple references to the same name can return different values due to the calculation being evaluated multiple times. If this is not the desired behavior, use [toscalar()](toscalar-function.md) or [materialize()](materialize-function.md).

## Syntax: Scalar or tabular expressions

`let` *Name* `=` *Expression*

> [!IMPORTANT]
> Let statements must be followed by a semicolon. There can be no blank lines between let statements or between let statements and other query statements.

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

### Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*Name*| `string` | :heavy_check_mark:|The variable name. You can escape the name with brackets. For example, `["Name with spaces"]`.|
|*Expression*| `string` | :heavy_check_mark:|An expression with a scalar or tabular result. For example, an expression with a scalar result would be `let one=1;`, and an expression with a tabular result would be `let RecentLog = Logs  | where Timestamp > ago(1h)`.|

## Syntax: View or function

`let` *Name* `=` [`view`] `(`[ *Parameters* ]`)` `{` *FunctionBody* `}`

> [!IMPORTANT]
> Let statements must be followed by a semicolon. There can be no blank lines between let statements or between let statements and other query statements.

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

### Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*FunctionBody* | `string` | :heavy_check_mark:| An expression that yields a user defined function. |
|`view`| `string` ||Only relevant for a parameter-less `let` statement. When used, the `let` statement is included in queries with a `union` operator with wildcard selection of the tables/views. For an example, see [Create a view or virtual table](#create-a-view-or-virtual-table).|
|*Parameters*| `string` ||Zero or more comma-separated tabular or scalar function parameters.<br/><br/>For each parameter of tabular type, the parameter should be in the format *TableName*`:`*TableSchema*, in which *TableSchema* is either a comma-separated list of columns in the format *ColumnName*`:`*ColumnType* or a wildcard (`*`). If columns are specified, then the input tabular argument must contain these columns. If a wildcard is specified, then the input tabular argument can have any schema. To reference columns in the function body, they must be specified. For examples, see [Tabular argument with schema](#tabular-argument-with-schema) and [Tabular argument with wildcard](#tabular-argument-with-wildcard).<br/><br/>For each parameter of scalar type, provide the parameter name and parameter type in the format *Name*`:`*Type*. The name can appear in the *FunctionBody* and is bound to a particular value when the user defined function is invoked. The only supported types are `bool`, `string`, `long`, `datetime`, `timespan`, `real`, `dynamic`, and the aliases to these types.|

> [!NOTE]
>
> * Tabular parameters must appear before scalar parameters.
> * Any two statements must be separated by a semicolon.

## Examples

The query examples show the syntax and example usage of the operator, statement, or function.

[!INCLUDE [help-cluster](../includes/help-cluster-note.md)]

### Define scalar values

The following example uses a scalar expression statement.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA2WPPQvCMBCG90D%2Bw5FJIUMHq1Cp4NfaQQcHcUjbownEBK4BF3%2B8V81Q8G57Xp7jXo8JkiUcbfQ91FAWWyk8Q8LBxcBE3XBMimlvEm%2FrcdGYJ1ZjIhcGDdcuElYuJA2Xr5OTpRR3KYBH7b3rUGlYlTqf0zk5xJb5umB%2BNjN%2BtIa8m5zyzzmZYDjYTFITKVklxUOKN7wsEv7%2Bgd2slQl9fg3qOhf7AKmU5Sz4AAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
let threshold = 50;
let region = "West";
datatable(Name:string, Score:int, Region:string)
[
    "Alice", 45, "West",
    "Bob", 60, "East",
    "Charlie", 55, "West",
    "Dana", 70, "North"
]
| where Score > threshold and Region == region
```

**Output**

| Name | Score | Region |
|--|--|--|
| Charlie | 55 | West |

### Define tabular expressions

The following example binds the name `some number` using the `['name']` notation, and then uses it in a tabular expression statement.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVGIVi/Oz01VyCvNTUotUo9VsFUwMrDmKkrMS09VqFRIK8rPVTBQKMnHUFdcklqgYAoALOYxk0IAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
let ['some number'] = 20;
range y from 0 to ['some number'] step 5
```

**Output**

| y |
|--|
| 0 |
| 5 |
| 10 |
| 15 |
| 20 |

### Create a user defined function with scalar calculation

This example uses the let statement with arguments for scalar calculation. The query defines function `MultiplyByN` for multiplying two numbers.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVHwLc0pySzIqXSq9FOwVdAoS8yxysnPS9dRyAPTmgrVCkAxBS2FPIVaa66ixLz0VIUKhbSi/FwFQ4WSfAVTheKS1AIgm6tGIbWiJDUvRaEotRhoKNA0JLM1KnQUTDUBj8joV3EAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
let MultiplyByN = (val:long, n:long) { val * n };
range x from 1 to 5 step 1 
| extend result = MultiplyByN(x, 5)
```

**Output**

| x | result |
|--|--|
| 1 | 5 |
| 2 | 10 |
| 3 | 15 |
| 4 | 20 |
| 5 | 25 |

### Create a user defined function that trims input

The following example removes leading and trailing ones from the input.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAzXMMQrCQBBA0T6n+KTaBQu3sEnwDDZeQMgYAtndMDPCgvHuBsTuVW8V565LvhUxrgQbzHUpc+TNgRz61J+wyGfs9FFmofHUmklnvJIumMtGotuR5lImVOy1+pH93+D1l4YW4xcl/CbOcQAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
let TrimOnes = (s:string) { trim("1", s) };
range x from 10 to 15 step 1 
| extend result = TrimOnes(tostring(x))
```

**Output**

| x | result |
|--|--|
| 10 | 0 |
| 11 |  |
| 12 | 2 |
| 13 | 3 |
| 14 | 4 |
| 15 | 5 |

### Use multiple let statements

This example defines two let statements where one statement (`foo2`) uses another (`foo1`).

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA03NQQqAIBCF4X2neEsFF+my6CwRZW3MCZsgqO5eakG7t/jmH2cZI5FGA9Gu3AWuHPlJobV++ObKdklb4kDo/GSxYww0I5+AKXlEmPlVFy6nzZv+JeJDoRV0Wb51+fhohZE40dPm+QYbBlAGmgAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
let foo1 = (_start:long, _end:long, _step:long) { range x from _start to _end step _step};
let foo2 = (_step:long) { foo1(1, 100, _step)};
foo2(2) | count
```

**Output**

| result |
|--|
| 50 |

### Create a view or virtual table

This example shows you how to use a let statement to create a [`view` or virtual table](schema-entities/views.md).

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVEISsxLTzU0ULBVKMtMLVfQ0FSoVigCiSn4Vjrn55Tm5imkFeXnKhgqlOQrANUVl6QWADm11lw5MN1GROo2QtZdnJpYlJyBUGZrq2AKAEWZgauQAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
let Range10 = view () { range MyColumn from 1 to 10 step 1 };
let Range20 = view () { range MyColumn from 1 to 20 step 1 };
search MyColumn == 5
```

**Output**

| $table | MyColumn |
|--|--|
| Range10 | 5 |
| Range20 | 5 |

### Use a materialize function

The [`materialize()`](materialize-function.md) function lets you cache subquery results during the time of query execution. When you use the `materialize()` function, the data is cached, and any subsequent invocation of the result uses cached data.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA4VSwU7DMAy9R8o%2FmGmHFlWjnFEvm3bjgNh%2BIEtNm5EmVZoydeLjcTqNZjBGLlGe7fee7Wj0sLVe6PUHGt%2FthmcrhVfWQAEbb11zwjn7hK5vGuHUEU8FK9sbT1ky3EkKuwGi2iVWypzfT5xp0mmER6eEJopyI22LtzSIboS3Q4tZzLw25Q9eKWSN5St2vQ6GIpnkl2RKNXF%2BEG2d3aP01%2FRCeG%2BVgXdlSuJWxqDjLOEM6FwSBeQfspQz6uE7FNgPNTqc%2BrsrYDa7nMSYfmPaf3gMdq5udvQw1%2FjmF9NYC5g7VdUTFA%2FmjGWRlyz6BRm8oJMUEVXYaWT4Hh7zfJHDQ5T9BV1xZJVzAgAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
let TotalEventsbyLocation = StormEvents
| summarize TotalCount = count() by Location = BeginLocation;
let materializedScope = StormEvents
| summarize by EventType, Location = EndLocation;
let cachedResult = materialize(materializedScope);
cachedResult
| project EventType, Location
| join kind = inner
(
    cachedResult
    | project EventType, Location
)
on EventType
| where Location != ""
| summarize EventCount = count() by Location
| join kind = inner
    TotalEventsbyLocation
on $left.Location == $right.Location
| project Location, EventCount, TotalCount, Percentage = EventCount * 100.0 / TotalCount
```

**Output**

| Location | EventCount | TotalCount | Percentage |
|--|--|--|--|
| MELBOURNE BEACH | 112 | 1 | 11,200 |
| EUSTIS | 13,854 | 12 | 115,450 |
| LOTTS | 6,910 | 1 | 691,000 |
| SERVICE | 997 | 1 | 99,700 |
| ... | ... | ... | ... |

### Using nested let statements

Nested let statements are permitted, including within a user defined function expression. Let statements and arguments apply in both the current and inner scope of the function body.

```kusto
let start_time = ago(5h); 
let end_time = start_time + 2h; 
T | where Time > start_time and Time < end_time | ...
```

### Tabular argument with schema

The following example specifies that the table parameter `T` must have a column `State` of type `string`. The table `T` may include other columns as well, but they can't be referenced in the function `StateState` because the aren't declared.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVEILkksSQUTthohVgoaYKaVQnFJUWZeuqamQrVCiEKNQmpFSWpeikJxfLEtUCY5sQSiTgeiXVOh1poruCS/KNe1LDWvpJirRiEzryw/OxXJdA1NoGhBUX5WajLUUh2QcQAWPcCygwAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
let StateState=(T: (State: string)) { T | extend s_s=strcat(State, State) };
StormEvents
| invoke StateState()
| project State, s_s
```

**Output**

| State | s_s |
|--|--|
| ATLANTIC SOUTH | ATLANTIC SOUTHATLANTIC SOUTH |
| FLORIDA | FLORIDAFLORIDA |
| FLORIDA | FLORIDAFLORIDA |
| GEORGIA | GEORGIAGEORGIA |
| MISSISSIPPI | MISSISSIPPIMISSISSIPPI |
| ... | ... |

### Tabular argument with wildcard

The table parameter `T` can have any schema, and the function `CountRecordsInTable` will work.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVFwzi/NKwlKTc4vSin2zAtJTMpJtdUIsVLQ0NLUVKhWCFGoUUgGKVGoteYKLskvynUtS80rKQYKZ+aV5WenYjNAQxMAvc2gqVoAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
let CountRecordsInTable=(T: (*)) { T | count };
StormEvents | invoke CountRecordsInTable()
```

**Output**

|Count|
|--|
|59,066|
