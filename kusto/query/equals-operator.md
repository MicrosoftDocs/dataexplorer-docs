---
title:  The case-insensitive =~ (equals) string operator
description: Learn how to use the =~ (equals) operator to filter a record set for data with a case-insensitive string.
ms.reviewer: alexans
ms.topic: reference
ms.date: 12/11/2022
---
# =~ (equals) operator

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Filters a record set for data with a case-insensitive string.

The following table provides a comparison of the `==` (equals) operators:

|Operator   |Description   |Case-Sensitive  |Example (yields `true`)  |
|-----------|--------------|----------------|-------------------------|
|[`==`](equals-cs-operator.md)|Equals |Yes|`"aBc" == "aBc"`|
|[`!=`](not-equals-cs-operator.md)|Not equals |Yes |`"abc" != "ABC"`|
|[`=~`](equals-operator.md) |Equals |No |`"abc" =~ "ABC"`|
|[`!~`](not-equals-operator.md) |Not equals |No |`"aBc" !~ "xyz"`|

For more information about other operators and to determine which operator is most appropriate for your query, see [datatype string operators](datatypes-string-operators.md).

## Performance tips

[!INCLUDE [performance-tip-note](../includes/performance-tip-note.md)]

When possible, use [==](equals-cs-operator.md) - a case-sensitive version of the operator.

## Syntax

*T* `|` `where` *col* `=~` `(`*expression*`)`

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

The `State` values in the `StormEvents` table are capitalized. The following query matches
columns with the value "KANSAS".

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKM9ILUpVCC5JLElVsK1TUMpOzCtOLFYCyhQU5WelJpcogJV6puhAFAEAU9ecID4AAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| where State =~ "kansas"
| project EventId, State
```

The following table only shows the first 10 results. To see the full output, run the query.

|EventId|State|
|--|--|
|70787 |KANSAS|
|43450 |KANSAS|
|43451 |KANSAS|
|38844 |KANSAS|
|18463 |KANSAS|
|18464 |KANSAS|
|18495 |KANSAS|
|43466 |KANSAS|
|43467 |KANSAS|
|43470 |KANSAS|
