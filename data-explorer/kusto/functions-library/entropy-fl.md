---
title:  entropy_fl()
description:  This article describes entropy_fl() user-defined function.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 09/10/2025
monikerRange: "microsoft-fabric || azure-data-explorer || azure-monitor || microsoft-sentinel"
---
# entropy_fl()

>[!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

The function `entropy_fl()` is a [user-defined function (UDF)](../query/functions/user-defined-functions.md) that calculates the [Shannon Entropy](https://en.wikipedia.org/wiki/Entropy_(information_theory)) of multiple probability vectors.

## Syntax

`T | invoke entropy_fl(`*val_col*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *val_col* | `string` |  :heavy_check_mark: | The name of the column containing the probability vectors.|

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/let-statement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/let-statement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabular-expression-statements.md). To run a working example of `time_weighted_avg_fl()`, see [Example](#example).

```kusto
let entropy_fl=(tbl:(*), val_col:string)
{
	tbl
    | extend _vals = column_ifexists(val_col, dynamic(null))
    | mv-apply pa=_vals to typeof(real) on 
    (summarize H=sum(-pa*log2(pa)))
    | project-away _vals
};
// Write your query to use the function here.
```

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Example](#example).

```kusto
.create-or-alter function with (folder = "Packages\\Stats", docstring = "Shannon entropy")
entropy_fl(tbl:(*), val_col:string)
{
	tbl
    | extend _vals = column_ifexists(val_col, dynamic(null))
    | mv-apply pa=_vals to typeof(real) on 
    (summarize H=sum(-pa*log2(pa)))
    | project-away _vals
}
```

---

## Example

The following example uses the [invoke operator](../query/invoke-operator.md) to run the function.

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

```kusto
let entropy_fl=(tbl:(*), val_col:string)
{
	tbl
    | extend _vals = column_ifexists(val_col, dynamic(null))
    | mv-apply pa=_vals to typeof(real) on 
    (summarize H=sum(-pa*log2(pa)))
    | project-away _vals
};
let probs = datatable(p:dynamic) [
    dynamic([0.2, 0.4, 0.3, 0.1]),
    dynamic([0.5, 0.5])
];
probs
| invoke entropy_fl('p')
```

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

```kusto
let probs = datatable(p:dynamic) [
    dynamic([0.2, 0.4, 0.3, 0.1]),
    dynamic([0.5, 0.5])
];
probs
| invoke entropy_fl('p')
```

---

**Output**

| p | H |
|---|---|
[0.2, 0.4, 0.3, 0.1] | 1.84643934467102 |
[0.5, 0.5] | 1 |