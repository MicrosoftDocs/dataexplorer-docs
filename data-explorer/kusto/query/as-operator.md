---
title:  as operator
description: Learn how to use the as operator to bind a name to the operator's input tabular expression.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/15/2025
---
# as operator

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Binds a name to the operator's input tabular expression. This operator allows the query to reference the value of the tabular expression multiple times without breaking the query and binding a name through the [let statement](let-statement.md).

To optimize multiple uses of the `as` operator within a single query, see [Named expressions](named-expressions.md).

## Syntax

*T* `|` `as` [`hint.materialized` `=` *Materialized*] *Name*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*T*| `string` |  :heavy_check_mark: | The tabular expression to rename.|
| *Name*| `string` |  :heavy_check_mark: | The temporary name for the tabular expression.|
| *`hint.materialized`*| `bool` |  | If *Materialized* is set to `true`, the value of the tabular expression output is wrapped by a [materialize()](materialize-function.md) function call. Otherwise, the value is recalculated on every reference.|

> [!NOTE]
>
> * The name given by `as` is used in the `withsource=` column of [union](union-operator.md), the `source_` column of [find](find-operator.md), and the `$table` column of [search](search-operator.md).
> * The tabular expression named using the operator in a [join](join-operator.md)'s outer tabular input (`$left`) can also be used in the join's tabular inner input (`$right`).

## Examples

In the following two examples, the generated TableName column consists of 'T1' and 'T2'.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAytKzEtPVahQSCvKz1UwVCjJVzA0UCguSS0Acni5ahQSixVCIKzSvMz8PIXyzJKM4vzSouRU25DEpJxUv8TcVAWNIjymQMww0gQAVf7ABmoAAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
range x from 1 to 10 step 1 
| as T1 
| union withsource=TableName (range x from 1 to 10 step 1 | as T2)
```

Alternatively, you can write the same example as follows:

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAyvNy8zPUyjPLMkozi8tSk61DUlMykn1S8xNVdAoSsxLT1WoUEgrys9VMFQoyVcwNFAoLkktAHJqFBKLFUIMNXWIUWakCQB5tG07ZwAAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
union withsource=TableName (range x from 1 to 10 step 1 | as T1), (range x from 1 to 10 step 1 | as T2)
```

**Output**

| TableName| x |
|--|---|
| T1 | 1 |
| T1 | 2 |
| T1 | 3 |
| T1 | 4 |
| T1 | 5 |
| T1 | 6 |
| T1 | 7 |
| T1 | 8 |
| T1 | 9 |
| T1 | 10 |
| T2 | 1 |
| T2 | 2 |
| T2 | 3 |
| T2 | 4 |
| T2 | 5 |
| T2 | 6 |
| T2 | 7 |
| T2 | 8 |
| T2 | 9 |
| T2 | 10 |


In the following example, the 'left side' of the join is:
`MyLogTable` filtered by `type == "Event"` and `Name == "Start"`
and the 'right side' of the join is:
`MyLogTable` filtered by `type == "Event"` and `Name == "Stop"`

```kusto
MyLogTable  
| where type == "Event"
| as T
| where Name == "Start"
| join (
    T
    | where Name == "Stop"
) on ActivityId
```
