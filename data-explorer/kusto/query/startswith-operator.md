---
title: The case-insensitive startswith string operator - Azure Data Explorer
description: This article describes the case-insensitive startswith string operator in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/30/2023
---
# startswith operator

Filters a record set for data with a case-insensitive string starting sequence.

The following table provides a comparison of the `startswith` operators:

|Operator   |Description   |Case-Sensitive  |Example (yields `true`)  |
|-----------|--------------|----------------|-------------------------|
|[`startswith`](startswith-operator.md) |RHS is an initial subsequence of LHS |No |`"Fabrikam" startswith "fab"`|
|[`!startswith`](not-startswith-operator.md) |RHS isn't an initial subsequence of LHS |No |`"Fabrikam" !startswith "kam"`|
|[`startswith_cs`](startswith-cs-operator.md)  |RHS is an initial subsequence of LHS |Yes |`"Fabrikam" startswith_cs "Fab"`|
|[`!startswith_cs`](not-startswith-cs-operator.md) |RHS isn't an initial subsequence of LHS |Yes |`"Fabrikam" !startswith_cs "fab"`|

> [!NOTE]
> The following abbreviations are used in the table above:
>
> * RHS = right hand side of the expression
> * LHS = left hand side of the expression

For further information about other operators and to determine which operator is most appropriate for your query, see [datatype string operators](datatypes-string-operators.md). 

## Performance tips

[!INCLUDE [performance-tip-note](../../includes/performance-tip-note.md)]

When possible, use the case-sensitive [startswith_cs](startswith-cs-operator.md).

## Syntax

*T* `|` `where` *col* `startswith` `(`*expression*`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T* | string | &check; | The tabular input to filter.|
| *col* | string | &check; | The column used to filter.|
| *expression* | string | &check; | The expression by which to filter.|

## Returns

Rows in *T* for which the predicate is `true`.

## Example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKC7NzU0syqxKVUgFCcUn55fmldiCSQ1NhaRKheCSxJJUoMLyjNSiVAhPobgksaikuDyzJENBySdfCS6LZISCnYKhAVCioCg/KzW5BKJRB1kFAIySNF2IAAAA" target="_blank">Run the query</a>

```kusto
StormEvents
| summarize event_count=count() by State
| where State startswith "Lo"
| where event_count > 10
| project State, event_count
```

**Output**

|State|event_count|
|-----|-----------|
|LOUISIANA|463|  
