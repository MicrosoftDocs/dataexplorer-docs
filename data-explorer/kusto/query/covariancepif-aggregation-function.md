---
title:  covariancepif() (aggregation function)
description: Learn how to use the covariancepif() aggregation function to calculate the population covariance in an expression where the predicate evaluates to true.
ms.reviewer: alexans
ms.topic: reference
ms.date: 03/08/2025
---
# covariancepif() (aggregation function)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculates the sample covariance of two random variables *expr1* and *expr2* in records for which *predicate* evaluates to `true`.

[!INCLUDE [ignore-nulls](../includes/ignore-nulls.md)]

The following formula is used:

:::image type="content" source="media/covariancep-aggfunction/covariance-population.png" alt-text="Image showing a covariance population formula.":::

[!INCLUDE [data-explorer-agg-function-summarize-note](../includes/agg-function-summarize-note.md)]

## Syntax

`covariancepif(`*expr1* `,` *expr2 `,` *predicate*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*expr1* | `real` |  :heavy_check_mark: | First random variable expression.|
|*expr2* | `real` |  :heavy_check_mark: | Second random variable expression.|
|*predicate*| `string` |  :heavy_check_mark: | If *predicate* evaluates to `true`, values of *expr1* and *expr2* will be added to the covariance.|

## Returns

Returns the covariance value of *expr1* and *expr2* in records for which *predicate* evaluates to `true`.

## Example

The example in this section shows how to use the syntax to help you get started.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAyXLsQ6DIBhF4d2nOItJbRxAZx6G6E%2FDABikBo0PX9pO9w7nyza%2BhIrLKaApCa0Ue5EN3d1ILRJXTgzeuUelZ8IY1NjMk%2Bk%2F89DS%2FR2Czf4SlnS0Y%2BMim29m5PxmPfNPDh%2B38u9%2BcwAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
range x from 1 to 100 step 1
| extend y = iff(x % 2 == 0, x * 2, x * 3)
| summarize covariancepif(x, y, x % 3 == 0)
```

**Output**

|covariancepif_x_y|
|---|---|
|2077.09090909091|
