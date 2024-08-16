---
title:  as operator
description: Learn how to use the as operator to bind a name to the operator's input tabular expression.
ms.reviewer: alexans
ms.topic: reference
ms.date: 03/14/2023
---
# as operator

Binds a name to the operator's input tabular expression. This allows the query to reference the value of the tabular expression multiple times without breaking the query and binding a name through the [let statement](let-statement.md).

To optimize multiple uses of the `as` operator within a single query, see [Named expressions](named-expressions.md).

## Syntax

*T* `|` `as` [`hint.materialized` `=` *Materialized*] *Name*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*T*| `string` |  :heavy_check_mark: | The tabular expression to rename.|
| *Name*| `string` |  :heavy_check_mark: | The temporary name for the tabular expression.|
| *`hint.materialized`*| `bool` |  | If *Materialized* is set to `true`, the value of the tabular expression will be as if it was wrapped by a [materialize()](./materialize-function.md) function call. Otherwise, the value will be recalculated on every reference.|

> [!NOTE]
>
> * The name given by `as` will be used in the `withsource=` column of [union](./union-operator.md), the `source_` column of [find](./find-operator.md), and the `$table` column of [search](./search-operator.md).
> * The tabular expression named using the operator in a [join](./join-operator.md)'s outer tabular input (`$left`) can also be used in the join's tabular inner input (`$right`).

## Examples

In the following two examples the union's generated TableName column will consist of 'T1' and 'T2'.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/?query=H4sIAAAAAAAAAytKzEtPVahQSCvKz1UwVCjJVzA0UCguSS0AcrhqFBKLFULAjNK8zPw8hfLMkozi/NKi5FTbkMSknFS/xNxUBY0iPGZAjDDSBAAgKK6faAAAAA==" target="_blank">Run the query</a>

```kusto
range x from 1 to 10 step 1 
| as T1 
| union withsource=TableName (range x from 1 to 10 step 1 | as T2)
```

Alternatively, you can write the same example as follows:

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/?query=H4sIAAAAAAAAAyvNy8zPUyjPLMkozi8tSk61DUlMykn1S8xNVdAoSsxLT1WoUEgrys9VMFQoyVcwNFAoLkktAHJqFBKLFUIMNXWIUWakCQB5tG07ZwAAAA==" target="_blank">Run the query</a>

```kusto
union withsource=TableName (range x from 1 to 10 step 1 | as T1), (range x from 1 to 10 step 1 | as T2)
```

In the following example, the 'left side' of the join will be:
`MyLogTable` filtered by `type == "Event"` and `Name == "Start"`
and the 'right side' of the join will be:
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
