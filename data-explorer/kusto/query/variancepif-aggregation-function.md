---
title:  variancepif() (aggregation function)
description: Learn how to use the variancepif() function to calculate the variance in an expression where the predicate evaluates to true.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# variancepif() (aggregation function)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculates the [variance](variancep-aggregation-function.md) of *expr* in records for which *predicate* evaluates to `true`.

[!INCLUDE [ignore-nulls](../includes/ignore-nulls.md)]

[!INCLUDE [data-explorer-agg-function-summarize-note](../includes/agg-function-summarize-note.md)]

## Syntax

`variancepif(`*expr*`,` *predicate*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*expr* | `string` |  :heavy_check_mark: | The expression to use for the variance calculation.|
|*predicate*| `string` |  :heavy_check_mark: | If *predicate* evaluates to `true`, the *expr* calculated value will be added to the variance.|

## Returns

Returns the variance value of *expr* in records for which *predicate* evaluates to `true`.

## Example

This query generates a sequence of numbers from 1 to 100 and then calculates the variance of the even numbers within that sequence. 

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAytKzEtPVahQSCvKz1UwVCjJVzA0MFAoLkktUDDkqlEoLs3NTSzKrEpVKANSiXnJqQWZaRoVOgoVqkYKtrYKBpoAMtNHI0EAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
range x from 1 to 100 step 1
| summarize variancepif(x, x%2 == 0)
```

**Output**

|variancepif_x|
|---|
|850|
