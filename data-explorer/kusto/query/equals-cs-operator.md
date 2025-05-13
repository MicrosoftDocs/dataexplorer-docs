---
title:  The case-sensitive == (equals) string operator
description: Learn how to use the == (equals) operator to filter a record set for data matching a case-sensitive string.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# == (equals) operator

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Filters a record set for data matching a case-sensitive string.

The following table provides a comparison of the `==` operators:

|Operator   |Description   |Case-Sensitive  |Example (yields `true`)  |
|-----------|--------------|----------------|-------------------------|
|[`==`](equals-cs-operator.md)|Equals |Yes|`"aBc" == "aBc"`|
|[`!=`](not-equals-cs-operator.md)|Not equals |Yes |`"abc" != "ABC"`|
|[`=~`](equals-operator.md) |Equals |No |`"abc" =~ "ABC"`|
|[`!~`](not-equals-operator.md) |Not equals |No |`"aBc" !~ "xyz"`|

For more information about other operators and to determine which operator is most appropriate for your query, see [datatype string operators](datatypes-string-operators.md).

## Performance tips

[!INCLUDE [performance-tip-note](../includes/performance-tip-note.md)]

## Syntax

*T* `|` `where` *col* `==` `(`*expression*`,` ... `)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T* | `string` |  :heavy_check_mark:| The tabular input whose records are to be filtered. |
| *col* | `string` |  :heavy_check_mark: | The column to filter. |
| *expression* | `string` |  :heavy_check_mark: | The expression used to filter. |

## Returns

Returns the rows in *T* for which the predicate is `true`.

## Examples

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5lIAghqF8ozUolSF4JLEklQFW1sFpezEvOLEYiWobHJ+aV4JACj9bS01AAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| where State == "kansas"
| count 
```

|Count|
|---|
|0|  

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKM9ILUpVCC5JLElVsLVVUPJ29At2DFYCyiTnl+aVAABkHSoPLQAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| where State == "KANSAS"
| count 
```

|Count|
|---|
|3,166|
